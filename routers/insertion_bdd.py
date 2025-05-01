from io import BytesIO
import sys
sys.path.append(r"C:/Users/User/Desktop/projet/Projet_2cs")
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import pandas as pd
from fastapi import APIRouter, UploadFile, Form, File, HTTPException, Depends
from routers.extraction_op import extract_costs_and_operations
from routers.extraction_rapport import extract_data
from database import get_db
from models import RapportJournalier,OperationJournaliere,Phase,Operation,Incident
from datetime import datetime
from sqlalchemy import func

# Routes
router_probleme = APIRouter(prefix="/probleme", tags=["probleme"])
router_extraction = APIRouter(prefix="/extraction", tags=["extraction"])
router_recup = APIRouter(prefix="/recuperation", tags=["recuperation"])
router_incident = APIRouter(prefix="/incident",tags=["incident"])
router_operation_journaliere=APIRouter(prefix="/op_journaliere",tags=["op_journaliere"])

#Functions and apis 
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
    


@router_extraction.post("/")
async def inserer_rapport_journalier(
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
    return {"message": "Données traitées avec succès", "user_id": user_id, "projet_id": projet_id, "rapport_id":rapport_journalier.id}




@router_recup.get("/")
def recuperer_rapport_excel(rapport_id: int):
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
    


@router_probleme.post("/")
async def inserer_probleme_operation_journaliere(
    operation_journaliere_id: int = Form(...),
    probleme: str = Form(...),
    solution: str = Form(...),
    fichier_joint: UploadFile = File(None) 
):
    db: Session = next(get_db())
    try:
        contenu_fichier = await fichier_joint.read() if fichier_joint else None

        daily_op = db.query(OperationJournaliere).filter(OperationJournaliere.id == operation_journaliere_id).first()
        if not daily_op:
            raise HTTPException(status_code=404, detail="Operation journaliere non trouvé.")

        daily_op.probleme = probleme
        daily_op.solution = solution
        daily_op.fichier_joint = contenu_fichier

        db.commit()
        return {"message": "📝 Problème ajouté avec succès."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {e}")
 

@router_incident.post("/")
async def inserer_incident(
    id_projet: int = Form(...),
    utilisateur: int = Form(...),
    date_incident: str = Form(...),  # Format attendu : "YYYY-MM-DD"
    fichier_joint: UploadFile = File(None)
):
    db: Session = next(get_db())
    try:
        print(date_incident)
        contenu_fichier = await fichier_joint.read() if fichier_joint else None

        # Vérification et conversion de la date
        try:
            date_incident_parsed = datetime.strptime(date_incident, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Format de date invalide. Utilisez YYYY-MM-DD.")

        nouvel_incident = Incident(
            id_projet=id_projet,
            utilisateur=utilisateur,
            date_incident=date_incident_parsed,
            fichier_joint=contenu_fichier
        )

        db.add(nouvel_incident)
        db.commit()
        db.refresh(nouvel_incident)

        return {"message": "🚨 Incident inséré avec succès.", "id_incident": nouvel_incident.id}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'insertion : {str(e)}")


@router_operation_journaliere.get("/")
def get_operation_journaliere_id_route(
    id_rapport: int,
    designation_operation: str,
):
    db: Session = next(get_db())
    # Étape 1 : Récupérer l'opération par sa désignation
    operation = db.query(Operation).filter(Operation.designation == designation_operation).first()
    if not operation:
        raise HTTPException(status_code=404, detail="Opération introuvable")

    # Étape 2 : Récupérer l'opération journalière
    op_journaliere = db.query(OperationJournaliere).filter(
        OperationJournaliere.id_rapport == id_rapport,
        OperationJournaliere.id_operation == operation.id
    ).first()

    if not op_journaliere:
        raise HTTPException(status_code=404, detail="Opération journalière non trouvée")

    return {"id": op_journaliere.id}


