from fastapi import FastAPI, Path, Depends ,HTTPException,APIRouter
from sqlalchemy.orm import Session
from typing import List

from models import PrevisionOperation ,PrevisionPhase
from pys_models import PrevisionOperationCreate ,PrevisionPhaseCreate , PrevisionPhaseOut , PrevisionOperationOut
from database import get_db

router =  APIRouter(prefix="/previsions", tags=["Prévision"])


@router.post("/operations/{id_projet}")
def create_previsions_operations(
    id_projet: int,
    previsions: List[PrevisionOperationCreate],
    db: Session = Depends(get_db)
):
    for item in previsions:
        prevision = PrevisionOperation(
            id_projet=id_projet,
            id_operation=item.id_operation,
            cout_prevu=item.cout_prevu,
            delais=item.delais
        )
        db.add(prevision)
    db.commit()
    return {"message": "Prévisions ajoutées avec succès"}

@router.post("/phases/{id_projet}")
def create_prevision_phases(
    id_projet: int,
    previsions: List[PrevisionPhaseCreate],
    db: Session = Depends(get_db)
):
    for item in previsions:
        prevision = PrevisionPhase(
            id_projet=id_projet,
            id_phase=item.id_phase,
            cout_prevu=item.cout_prevu,
            delais=item.delais,
            profondeur=item.profondeur
        )
        db.add(prevision)
    db.commit()
    return {"message": "Prévisions de phases ajoutées avec succès"}

@router.get("/phases", response_model=list[PrevisionPhaseOut])
def get_phases(db: Session = Depends(get_db)):
    return db.query(PrevisionPhase).all()

@router.get("/operations", response_model=list[PrevisionOperationOut])
def get_phases(db: Session = Depends(get_db)):
    return db.query(PrevisionOperation).all()

