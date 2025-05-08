from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from pys_models import OperationOut, OperationCreate
from models import Operation
from typing import List  # Import nécessaire pour List
from fastapi import HTTPException

router = APIRouter(prefix="/operation", tags=["operation"])

@router.post("/", response_model=List[OperationOut])  # Notez le List[OperationOut]
def create_operations(
    operations: List[OperationCreate],  # Accepte une liste d'opérations
    db: Session = Depends(get_db)
):
    created_operations = []
    
    try:
        for operation in operations:  # Itération sur la liste
            # Validation des données
            if operation.categorie not in ["Fixe", "Variable"]:
                raise HTTPException(
                    status_code=400,
                    detail=f"Catégorie invalide : {operation.categorie}"
                )
            
            # Conversion en majuscules
            operation_data = operation.dict()
            operation_data["designation"] = operation_data["designation"].upper()
            
            # Création de l'opération
            new_op = Operation(**operation_data)
            db.add(new_op)
            created_operations.append(new_op)
        
        db.commit()
        
        # Rafraîchissement des objets
        for op in created_operations:
            db.refresh(op)
            
        return created_operations
        
    except Exception as e:
        db.rollback()  # Annulation des changements en cas d'erreur
        print(f"❌ Erreur critique : {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Erreur serveur : {str(e)}"
        )
    

@router.get("/", response_model=list[OperationOut])
def get_phases(db: Session = Depends(get_db)):
    return db.query(Operation).all()