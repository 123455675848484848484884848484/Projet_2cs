from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Incident  # ton modèle SQLAlchemy
from pys_models import IncidentCreate, IncidentOut
from database import get_db  # ta session SQLAlchemy
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from fastapi import APIRouter, UploadFile, File, Form, Depends
from datetime import date
from typing import Optional


router = APIRouter(prefix="/incident", tags=["Incident"])

from sqlalchemy.exc import SQLAlchemyError

@router.post("/", response_model=IncidentOut)
def create_incident(
    id_projet: int = Form(...),
    utilisateur: int = Form(...),
    date_incident: date = Form(...),
    description: Optional[str] = Form(None),
    fichier_joint: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    try:
        fichier_data = fichier_joint.file.read() if fichier_joint else None

        new_incident = Incident(
            id_projet=id_projet,
            id_utilisateur=utilisateur,
            date_incident=date_incident,
            description=description,
            fichier_joint=fichier_data,
        )
        db.add(new_incident)
        db.commit()
        db.refresh(new_incident)
        return new_incident

    except SQLAlchemyError as e:
        db.rollback()
        return {"error": f"Database error: {str(e)}"}

    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}"}
