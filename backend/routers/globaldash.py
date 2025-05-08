#gvhjhkjh
from models import Projet , UserProjet 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db  # Assure-toi d’avoir cette fonction
from models import Projet, UserProjet, RapportJournalier
from sqlalchemy import func

router = APIRouter(prefix="/globaldash", tags=["globaldash"])

@router.get("/{user_id}")
def get_rapport_utilisation(user_id: int, db: Session = Depends(get_db)):
    projets = db.query(UserProjet.id_projet).filter(UserProjet.id_utilisateur == user_id).all()
    id_projets = [p.id_projet for p in projets]

    if not id_projets:
        raise HTTPException(status_code=404, detail="Aucun projet trouvé pour cet utilisateur")

    rapport = {}

    for id_projet in id_projets:
        projet = db.query(Projet).filter(Projet.id == id_projet).first()
        if not projet:
            continue

        budget_total = float(projet.budget_total or 0)

        cout_reel = db.query(func.coalesce(func.sum(RapportJournalier.daily_cost), 0)).filter(
            RapportJournalier.id_projet == id_projet
        ).scalar()

        if budget_total > 0:
            ratio_percent = (cout_reel / budget_total) * 100
            rapport[projet.name] = round(ratio_percent, 2)  # Retourne en nombre décimal
        else:
            rapport[projet.name] = None  # Si pas de budget

    return rapport
