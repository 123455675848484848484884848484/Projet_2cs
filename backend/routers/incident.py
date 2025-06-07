from io import BytesIO
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
from typing import List
from fastapi.responses import StreamingResponse
from fastapi import HTTPException

import base64
from typing import List
from fastapi import HTTPException

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



# Recuperer tous les incidents lies a un projet
@router.get("/projet/{id_projet}", response_model=List[IncidentOut])
def get_incidents_by_projet(id_projet: int, db: Session = Depends(get_db)):
    incidents = db.query(Incident).filter(Incident.id_projet == id_projet).all()
    if not incidents:
        raise HTTPException(status_code=404, detail="Aucun incident trouvé pour ce projet")

    incidents_out = []
    for incident in incidents:
        fichier_base64 = None
        if incident.fichier_joint:
            fichier_base64 = base64.b64encode(incident.fichier_joint).decode("utf-8")
        incidents_out.append(
            IncidentOut(
                id=incident.id,
                id_projet=incident.id_projet,
                id_utilisateur=incident.id_utilisateur,
                date_incident=incident.date_incident,
                description=incident.description,
                fichier_joint=fichier_base64,
            )
        )
    return incidents_out

# Telechargement du fichier joint a l'incident : pdf
@router.get("/download/{id_incident}")
def download_fichier_incident(id_incident: int, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == id_incident).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident non trouvé")
    if not incident.fichier_joint:
        raise HTTPException(status_code=404, detail="Aucun fichier joint pour cet incident")

    # Préparer le fichier pour la réponse
    file_like = BytesIO(incident.fichier_joint)
    filename = f"incident_{id_incident}_fichier.pdf"

    return StreamingResponse(
        file_like,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


