from fastapi import FastAPI, Path, Depends ,HTTPException,APIRouter
from sqlalchemy.orm import Session
from typing import List , Dict

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





@router.get("/prevision_phases/{projet_id}")
def get_previsions_phase(projet_id: int, db: Session = Depends(get_db)):
    rows = (
        db.query(
            PrevisionPhase.id,
            PrevisionPhase.cout_prevu,
            PrevisionPhase.delais,
            PrevisionPhase.profondeur,
            Phase.designation.label("nom_phase")
        )
        .join(Phase, PrevisionPhase.id_phase == Phase.id)
        .filter(PrevisionPhase.id_projet == projet_id)
        .all()
    )

    return [row._asdict() for row in rows]

@router.get("/prevision_operations/{projet_id}")
def get_prevision_operations(
    projet_id: int,
    db: Session = Depends(get_db)
) -> List[Dict]:
    # Une seule requête SQL avec JOIN pour récupérer la désignation
    rows = (
        db.query(
            PrevisionOperation.id,
            PrevisionOperation.cout_prevu,
            PrevisionOperation.delais,
            Operation.designation.label("nom_operation")   # ← le nom de l’opération
        )
        .join(Operation, PrevisionOperation.id_operation == Operation.id)
        .filter(PrevisionOperation.id_projet == projet_id)
        .all()
    )

    # rows = liste de namedtuples → on les convertit en dict lisibles par FastAPI
    return [row._asdict() for row in rows]
