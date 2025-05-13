from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Projet, UserProjet, Utilisateur , PrevisionPhase ,RapportJournalier
from pys_models import ProjetCreate, ProjetOut,AffectationCreate
from datetime import timedelta

router = APIRouter(prefix="/projets", tags=["Projets"])

@router.post("/")
def create_projet(projet: ProjetCreate, db: Session = Depends(get_db)):
    db_projet = Projet(**projet.dict())
    db.add(db_projet)
    db.commit()
    db.refresh(db_projet)
    print(db_projet)
    
    user_projet = UserProjet(id_utilisateur=projet.created_by, id_projet=db_projet.id)
    db.add(user_projet)
    db.commit()
    return {"id": db_projet.id}

@router.get("/")
def get_projets(db: Session = Depends(get_db)):
    projets = db.query(Projet).all()
    return projets



@router.post("/affecter")
def affecter_utilisateur_a_projet(affectation: AffectationCreate, db: Session = Depends(get_db)):
    # Vérifie si l'association existe
    association_existante = db.query(UserProjet).filter_by(
        id_utilisateur=affectation.id_utilisateur,
        id_projet=affectation.id_projet
    ).first()

    if association_existante:
        raise HTTPException(status_code=400, detail="Utilisateur déjà affecté à ce projet.")

    # Affectation
    nouvelle_affectation = UserProjet(
        id_utilisateur=affectation.id_utilisateur,
        id_projet=affectation.id_projet
    )
    db.add(nouvelle_affectation)
    db.commit()

    return {
        "message": "Utilisateur affecté avec succès.",
        "id_utilisateur": affectation.id_utilisateur,
        "id_projet": affectation.id_projet
    }


@router.get("/{id_utilisateur}")
def get_projets_par_utilisateur(id_utilisateur: int, db: Session = Depends(get_db)):
    projets_ids = db.query(UserProjet.id_projet).filter(UserProjet.id_utilisateur == id_utilisateur).all()

    if not projets_ids:
        raise HTTPException(status_code=404, detail="Aucun projet trouvé pour cet utilisateur.")


    projets_ids = [pid for (pid,) in projets_ids]
    projets = db.query(Projet).filter(Projet.id.in_(projets_ids)).all()

    return [  
        {
            "name": projet.name,
            "date_debut": projet.date_debut,
            "budget_total": projet.budget_total,
            "duree_prevue": projet.duree_prevue,
            "wilaya": projet.wilaya,
            "adresse": projet.adresse,
        }
        for projet in projets
    ]
    

@router.get("/{id_projet}/details")
def get_projet_avec_equipe(id_projet: int, db: Session = Depends(get_db)):
    # Récupérer le projet
    projet = db.query(Projet).filter(Projet.id == id_projet).first()
    if not projet:
        raise HTTPException(status_code=404, detail="Projet non trouvé.")

    # Récupérer les IDs des utilisateurs liés au projet
    utilisateur_ids = db.query(UserProjet.id_utilisateur).filter(UserProjet.id_projet == id_projet).all()
    utilisateur_ids = [uid for (uid,) in utilisateur_ids]

    # Récupérer uniquement les noms
    noms = db.query(Utilisateur.name).filter(Utilisateur.id.in_(utilisateur_ids)).all()
    noms_equipes = [nom for (nom,) in noms]

    # Réponse JSON
    return {
        "id": projet.id,
        "name": projet.name,
        "date_debut": str(projet.date_debut),
        "created_by": projet.created_by,
        "lieu": projet.lieu,
        "budget_total": float(projet.budget_total or 0),
        "duree_prevue": projet.duree_prevue,
        "wilaya": projet.wilaya,
        "adresse": projet.adresse,
        "closed": projet.closed,
        "equipe": noms_equipes
    }


@router.get("/{projet_id}/dates")
def calculer_dates(projet_id: int, db: Session = Depends(get_db)):
    
    projet = db.query(Projet).filter(Projet.id == projet_id).first()
    if not projet:
        raise HTTPException(status_code=404, detail="Projet non trouvé")

    date_debut = projet.date_debut
    duree_prevue = projet.duree_prevue


    date_fin_previsionnelle = date_debut + timedelta(days=duree_prevue)

    # 3. Calcul des retards
    retard_total = 0
    previsions = db.query(PrevisionPhase).filter(PrevisionPhase.id_projet == projet_id).all()

    for prev in previsions:
        id_phase = prev.id_phase
        duree_prevue_phase = prev.delais

        # Compter les rapports journaliers pour cette phase et ce projet
        nb_rapports = db.query(RapportJournalier)\
                        .filter(RapportJournalier.id_projet == projet_id)\
                        .filter(RapportJournalier.phase == id_phase)\
                        .count()

        # Si on dépasse la durée prévue, on a un retard
        retard = max(0, nb_rapports - duree_prevue_phase)
        retard_total += retard

    # 4. Calculer la date réelle estimée
    date_fin_estimee = date_fin_previsionnelle + timedelta(days=retard_total)

    return {
        "projet": projet.name,
        "date_debut": date_debut,
        "date_fin_previsionnelle": date_fin_previsionnelle,
        "retard_total_jours": retard_total,
        "date_fin_estimee": date_fin_estimee
    }
