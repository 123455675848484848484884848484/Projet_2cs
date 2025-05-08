from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Projet, UserProjet
from pys_models import ProjetCreate, ProjetOut

router = APIRouter(prefix="/projets", tags=["Projets"])

@router.post("/")
def create_projet(projet: ProjetCreate, db: Session = Depends(get_db)):
    db_projet = Projet(**projet.dict())
    db.add(db_projet)
    db.commit()
    db.refresh(db_projet)
    
    user_projet = UserProjet(id_utilisateur=projet.created_by, id_projet=db_projet.id)
    db.add(user_projet)
    db.commit()
    return {"id": db_projet.id}

@router.get("/")
def get_projets(db: Session = Depends(get_db)):
    projets = db.query(Projet).all()
    return projets
