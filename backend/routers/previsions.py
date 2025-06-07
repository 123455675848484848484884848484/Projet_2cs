from fastapi import FastAPI, Path, Depends ,HTTPException,APIRouter
from sqlalchemy.orm import Session
from typing import List

from models import PrevisionOperation ,PrevisionPhase ,Operation , Phase
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

@router.get("/phases")
def get_phases(db: Session = Depends(get_db)):
    return db.query(PrevisionPhase).all()

@router.get("/operations", response_model=list[PrevisionOperationOut])
def get_phases(db: Session = Depends(get_db)):
    return db.query(PrevisionOperation).all()





@router.get("/prevision_phases/{projet_id}", response_model=List[PrevisionPhaseOut])

def get_previsions_phase(projet_id: int, db: Session = Depends(get_db)):
    previsions = db.query(PrevisionPhase).filter(PrevisionPhase.id_projet == projet_id).all()
    for p in previsions:
        phase = db.query(Phase).filter(Phase.id == p.id_phase).first()
        p.nom_phase = phase.designation if phase else None
    return previsions


@router.get("/prevision_operations/{id_projet}", response_model=List[PrevisionOperationOut])
def get_prevision_operations(id_projet: int, db: Session = Depends(get_db)):
    previsions = db.query(PrevisionOperation).filter(PrevisionOperation.id_projet == id_projet).all()
    for p in previsions:
        operation = db.query(Operation).filter(Operation.id == p.id_operation).first()
        p.nom_operation = operation.designation if operation else None
    return previsions

