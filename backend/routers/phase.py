from typing import List
from fastapi import HTTPException, status,APIRouter , Depends
from sqlalchemy.orm import Session
from pys_models import PhaseCreate , PhaseOut 
from database import get_db
from models import Phase

router = APIRouter(prefix="/phase", tags=["phase"])
@router.post("/", response_model=List[PhaseOut])  
def create_phases(
    phases: List[PhaseCreate],  
    db: Session = Depends(get_db)
):
    created_phases = []
    
    try:
        for phase in phases:
            # Validation si nécessaire (ex: vérifier que la designation n'est pas vide)
            if not phase.designation or not phase.designation.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="La désignation de la phase ne peut pas être vide"
                )
            
            # Création de la phase
            new_phase = Phase(
                designation=phase.designation.upper()  
            )
            
            db.add(new_phase)
            created_phases.append(new_phase)
        
        db.commit()
        
        # Rafraîchissement des objets créés
        for phase in created_phases:
            db.refresh(phase)
            
        return created_phases
        
    except HTTPException:
        db.rollback()
        raise  
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la création des phases en base de données"
        )
@router.get("/", response_model=list[PhaseOut])
def get_phases(db: Session = Depends(get_db)):
    return db.query(Phase).limit(4).all()




