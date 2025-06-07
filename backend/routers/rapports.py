from io import BytesIO
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import RapportJournalier
from database import get_db
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/rapports", tags=["Rapports"])

#Recuperer tous les rapports journaliers d'un projet
@router.get("/{id_projet}")
def get_rapports_journaliers(id_projet: int, db: Session = Depends(get_db)):
    rapports = db.query(RapportJournalier).filter(RapportJournalier.id_projet == id_projet).all()
    
    if not rapports:
        raise HTTPException(status_code=404, detail="Aucun rapport trouvé pour ce projet")

    result = []
    for r in rapports:
        rapport_dict = {
            "id": r.id,
            "id_projet": r.id_projet,
            "date_rapport": r.date_rapport,
            "daily_cost": float(r.daily_cost),
            "commentaire": r.commentaire,
            "profondeur": float(r.profondeur) if r.profondeur is not None else None,
            "userid": r.userid,
            "phase": r.phase
        }
        result.append(rapport_dict)

    return result

# Recuperer le rapport journalier a travers l'id  (pour le telechargement : fichier xlsv)
@router.get("/recuperer/{rapport_id}")
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
    
