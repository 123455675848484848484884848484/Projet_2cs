from fastapi import APIRouter, Depends ,HTTPException
from sqlalchemy.orm import Session
from database import get_db
from pydantic import BaseModel
from models import Utilisateur ,UserProjet ,Projet
from typing import List, Optional
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



@router.put("/{utilisateur_id}", response_model=UtilisateurOut)
def update_utilisateur(utilisateur_id: int, updated_data: UtilisateurCreate, db: Session = Depends(get_db)):
    utilisateur = db.query(Utilisateur).filter(Utilisateur.id == utilisateur_id).first()
    if not utilisateur:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    utilisateur.name = updated_data.name
    utilisateur.email = updated_data.email
    utilisateur.role = updated_data.role

    db.commit()
    db.refresh(utilisateur)
    return utilisateur


@router.delete("/{utilisateur_id}")
def delete_utilisateur(utilisateur_id: int, db: Session = Depends(get_db)):
    try:
        utilisateur = db.query(Utilisateur).filter(Utilisateur.id == utilisateur_id).first()
        if not utilisateur:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
        db.delete(utilisateur)
        db.commit()
        return {"message": "Utilisateur supprimé avec succès"}
    except Exception as e:
        print("Erreur lors de la suppression :", str(e))  
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {str(e)}")




@router.get("/search", response_model=List[UtilisateurOut])
def search_utilisateurs(keyword: Optional[str] = None, db: Session = Depends(get_db)):
    if keyword:
        return db.query(Utilisateur).filter(Utilisateur.name.ilike(f"%{keyword}%")).all()
    return db.query(Utilisateur).all()


@router.get("/{utilisateur_id}", response_model=UtilisateurOut)
def retourner_utilisateur(utilisateur_id: int,  db: Session = Depends(get_db)):
    try:
        utilisateur = db.query(Utilisateur).filter(Utilisateur.id == utilisateur_id).first()
        if not utilisateur:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
        return(utilisateur)
    except Exception as e:
        print("Erreur lors de la suppression :", str(e))  
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {str(e)}")



class ProjetNom(BaseModel):
    name: str

    class Config:
        orm_mode = True

@router.get("/{utilisateur_id}/projets", response_model=List[ProjetNom])
def get_projets_utilisateur(utilisateur_id: int, db: Session = Depends(get_db)):
    try:
        projets = (
            db.query(Projet.name)
            .join(UserProjet, Projet.id == UserProjet.id_projet)
            .filter(UserProjet.id_utilisateur == utilisateur_id)
            .all()
        )

        

        return projets

    except Exception as e:
        print("Erreur lors de la récupération des projets :", str(e))
        raise HTTPException(status_code=500, detail="Erreur interne du serveur")
    

@router.get("/non_affectes/{user_id}")
def get_projets_non_affectes(user_id: int, db: Session = Depends(get_db)):
    # Sous-requête : les ID des projets où l'utilisateur est déjà affecté
    sous_requete = (
        db.query(UserProjet.id_projet)
        .filter(UserProjet.id_utilisateur == user_id)
        .subquery()
    )

    # Tous les projets sauf ceux déjà affectés
    projets = db.query(Projet).filter(Projet.id.notin_(sous_requete)).all()
    return projets
