from models import Projet , UserProjet 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db  
from models import Projet, UserProjet, RapportJournalier
from sqlalchemy import func

router = APIRouter(prefix="/globaldash", tags=["globaldash"])


@router.get("/{user_id}/couts")
def get_rapport_utilisation(user_id: int, db: Session = Depends(get_db)):
    projets = db.query(UserProjet.id_projet).filter(UserProjet.id_utilisateur== user_id).all()

    if not projets:
        raise HTTPException(status_code=404, detail="Aucun projet trouvé pour cet utilisateur")

    rapport_utilisation = {}

    for (id_projet,) in projets:
        projet = db.query(Projet).filter(Projet.id == id_projet).first()
        if not projet:
            continue 

        budget_total = projet.budget_total or 0

        cout_reel = db.query(
            func.coalesce(func.sum(RapportJournalier.daily_cost), 0)
        ).filter(
            RapportJournalier.id_projet == id_projet
        ).scalar()

        if budget_total > 0:
            ratio_percent = (cout_reel / budget_total) * 100
            rapport_utilisation[projet.name] = round(ratio_percent, 2)
        else:
            rapport_utilisation[projet.name] = 0  
            

    return rapport_utilisation


@router.get("/{user_id}/delais")
def get_rapport_counts_by_user(user_id: int):
    db: Session = next(get_db())

    projets = db.query(UserProjet.id_projet).filter(UserProjet.id_utilisateur == user_id).all()

    if not projets:
        raise HTTPException(status_code=404, detail="Aucun projet trouvé pour cet utilisateur.")

    resultats = {}
    for (id_projet,) in projets:
        count = db.query(RapportJournalier).filter(RapportJournalier.id_projet == id_projet).count()
        projet = db.query(Projet).filter(Projet.id == id_projet).first()
        
        if projet and projet.duree_prevue > 0:
            delais = count / projet.duree_prevue
            resultats[projet.name] = round(delais, 2) 
        else:
            resultats[projet.name] = 0  

    return resultats

