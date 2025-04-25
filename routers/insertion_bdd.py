from io import BytesIO
import sys
sys.path.append(r"C:/Users/User/Desktop/projet/Projet_2cs")
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import pandas as pd
from fastapi import APIRouter,UploadFile,Form,File,HTTPException
from routers.extraction_op import extract_costs_and_operations
from routers.extraction_rapport import extract_data
from database import get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker , declarative_base
from models import RapportJournalier,OperationJournaliere,Phase,Operation
from datetime import datetime
from sqlalchemy import func
import os


def get_or_create_operation(db: Session, designation: str):
    existing_operation = db.query(Operation).filter(func.to_char(Operation.designation) == designation).first()
    
    if existing_operation:
        print(existing_operation.id)
        return existing_operation.id
    else:
        new_operation = Operation(designation=designation,categorie="Variable")
        db.add(new_operation)
        db.commit() 
        db.refresh(new_operation)  
        return new_operation.id
    
router_extraction = APIRouter(prefix="/extraction",
    tags=["extraction"]
)

router_recup = APIRouter(prefix="/recuperation",
    tags=["recuperation"]
)

@router_extraction.post("/")
async def process_and_insert_data(
    user_id: int = Form(...),  
    projet_id: int = Form(...),  
    file: UploadFile = File(...)  
):
    
    db: Session = next(get_db())  

    content = file.file.read()
    print("✔️ Fichier lu avec succès. Taille:", len(content), "octets")

    data = extract_data(content=content)  
    existing_phase = db.query(Phase).filter(func.to_char(Phase.designation) == data["BIT SIZE"]).first()
    if not existing_phase:
        new_phase = Phase(designation=data["BIT SIZE"])
        db.add(new_phase)
        db.commit()
        db.refresh(new_phase)
        phase_id = new_phase.id
        print(f"Nouvelle phase ajoutée avec l'ID : {phase_id}")
    else:
        phase_id = existing_phase.id
        print(f"Phase existante récupérée avec l'ID : {phase_id}")

    raw_date = data["Date"]
    date_obj = datetime.strptime(raw_date, "%m/%d/%Y")
    formatted_date = date_obj.strftime("%d/%m/%Y")
    print(formatted_date)

    profondeur = data["Depth @ 24h"]
    if isinstance(profondeur, str):
        try:
            profondeur = float(profondeur)
        except ValueError:
            profondeur = None

    print("Profondeur:", profondeur)

    rapport_journalier = RapportJournalier(
        id_projet=projet_id,
        date_rapport=formatted_date,
        daily_cost=data["Daily Cost"],
        commentaire=None,
        profondeur=profondeur,
        fichier_excel=content, 
        userid=user_id,
        phase=phase_id
    )

    db.add(rapport_journalier)
    db.commit()
    print(f"Rapport inséré avec succès ! ID: {rapport_journalier.id}")

    operations = extract_costs_and_operations(content=content)

    # Traitement des opérations
    for operation, cost in operations.items():
        if cost != "--":
            try:
                cost = float(cost.replace(" ", "").replace(",", "")) 
            except ValueError:
                cost = None
        else:
            cost = None

        try:
            operation_id = get_or_create_operation(db, operation)
            operation_journaliere = OperationJournaliere(
                id_rapport=rapport_journalier.id,
                description=operation,
                cout=cost,
                id_operation=operation_id,
                probleme=None,
                solution=None,
                fichier_joint=None
            )
            db.add(operation_journaliere)
            db.commit()
        except Exception as e:
            print(f"Erreur lors de l'ajout de l'opération : {e}")

    print("Insertion réussie ✅")
    return {"message": "Données traitées avec succès", "user_id": user_id, "projet_id": projet_id}




@router_recup.get("/")
def send_excel_file(rapport_id: int):
    try:
        db: Session = next(get_db())
        rapport = db.query(RapportJournalier).filter(RapportJournalier.id == rapport_id).first()

        if not rapport or not rapport.fichier_excel:
            raise HTTPException(status_code=404, detail="Fichier non trouvé dans la base de données.")

        file_like = BytesIO(rapport.fichier_excel)
        filename = f"rapport_{rapport_id}.xlsv"

        return StreamingResponse(
            file_like,
            media_type="application/vnd.ms-excel",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    except Exception as e:
        print(f"❌ Erreur lors de l'envoi du fichier : {e}")
        raise HTTPException(status_code=500, detail="Erreur interne lors de l'envoi du fichier.")