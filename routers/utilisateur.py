from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Utilisateur
from pys_models import UtilisateurCreate, UtilisateurOut

router = APIRouter(prefix="/utilisateur",
    tags=["utilisateur"]
)

@router.get("/", response_model=list[UtilisateurOut])
def get_utilisateurs(db: Session = Depends(get_db)):
    return db.query(Utilisateur).all()

@router.post("/", response_model=UtilisateurOut)
def create_utilisateur(user: UtilisateurCreate, db: Session = Depends(get_db)):
    db_user = Utilisateur(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


