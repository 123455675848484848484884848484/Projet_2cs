#gvhjhkjh
from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from models import UserProjet, RapportJournalier  
from database import get_db

router_user_projet = APIRouter(prefix="/delais_projets",tags=["delais_projets"])

@router_user_projet.get("/")
def get_rapport_counts_by_user(id_utilisateur: int):
    db: Session = next(get_db())

    projets = db.query(UserProjet.id_projet).filter(UserProjet.id_utilisateur == id_utilisateur).all()

    if not projets:
        raise HTTPException(status_code=404, detail="Aucun projet trouvé pour cet utilisateur.")

    resultats = {}
    for (id_projet,) in projets:
        count = db.query(RapportJournalier).filter(RapportJournalier.id_projet == id_projet).count()
        resultats[id_projet] = count

    return resultats
