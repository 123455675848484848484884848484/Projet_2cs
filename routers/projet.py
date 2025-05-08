from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Projet
from pys_models import ProjetCreate, ProjetOut

router = APIRouter(prefix="/projets", tags=["Projets"])

@router.post("/")
def create_projet(projet: ProjetCreate, db: Session = Depends(get_db)):
    db_projet = Projet(**projet.dict())
    db.add(db_projet)
    db.commit()
    db.refresh(db_projet)
    return {"id": db_projet.id}

@router.get("/")
def get_projets(db: Session = Depends(get_db)):
    projets = db.query(Projet).all()
    return projets
