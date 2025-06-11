from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db  
from sqlalchemy import func, desc
from models import UserProjet, Projet, RapportJournalier, Incident  

router = APIRouter(prefix="/globaldash", tags=["globaldash"])


@router.get("/{user_id}/couts")
def get_rapport_utilisation(user_id: int, db: Session = Depends(get_db)):
    projets = db.query(UserProjet.id_projet).filter(UserProjet.id_utilisateur== user_id).all()

    if not projets:
        raise HTTPException(status_code=404, detail="Aucun projet trouvé pour cet utilisateur")

    rapport_utilisation = {}

    for (id_projet,) in projets:
        projet = db.query(Projet).filter(Projet.id == id_projet).first()
        if not projet:
            continue 

        budget_total = projet.budget_total or 0

        cout_reel = db.query(
            func.coalesce(func.sum(RapportJournalier.daily_cost), 0)
        ).filter(
            RapportJournalier.id_projet == id_projet
        ).scalar()

        if budget_total > 0:
            ratio_percent = (cout_reel / budget_total) * 100
            rapport_utilisation[projet.name] = round(ratio_percent, 2)
        else:
            rapport_utilisation[projet.name] = 0  
            

    return rapport_utilisation


@router.get("/{user_id}/delais")
def get_rapport_counts_by_user(user_id: int):
    db: Session = next(get_db())

    projets = db.query(UserProjet.id_projet).filter(UserProjet.id_utilisateur == user_id).all()

    if not projets:
        raise HTTPException(status_code=404, detail="Aucun projet trouvé pour cet utilisateur.")

    resultats = {}
    for (id_projet,) in projets:
        count = db.query(RapportJournalier).filter(RapportJournalier.id_projet == id_projet).count()
        projet = db.query(Projet).filter(Projet.id == id_projet).first()
        
        if projet and projet.duree_prevue > 0:
            delais = count / projet.duree_prevue
            resultats[projet.name] = round(delais, 2) 
        else:
            resultats[projet.name] = 0  

    return resultats





@router.get("/{user_id}/details")
def get_user_projets_details(user_id: int, db: Session = Depends(get_db)):
    projets_ids = db.query(UserProjet.id_projet).filter(UserProjet.id_utilisateur == user_id).all()
    
    if not projets_ids:
        raise HTTPException(status_code=404, detail="Aucun projet trouvé pour cet utilisateur")

    resultats = []

    for (id_projet,) in projets_ids:
        projet = db.query(Projet).filter(Projet.id == id_projet).first()
        if not projet:
            continue

        # Dernier rapport pour la profondeur
        dernier_rapport = db.query(RapportJournalier).filter(
            RapportJournalier.id_projet == id_projet
        ).order_by(desc(RapportJournalier.date_rapport)).first()

        profondeur = dernier_rapport.profondeur if dernier_rapport else None

        # Coût réel = somme des daily_cost
        cout_reel = db.query(func.coalesce(func.sum(RapportJournalier.daily_cost), 0)).filter(
            RapportJournalier.id_projet == id_projet
        ).scalar()

        # Délai écoulé = nombre de rapports journaliers
        delai_ecoule = db.query(func.count()).filter(
            RapportJournalier.id_projet == id_projet
        ).scalar()

        # Incidents liés au projet
        has_incident = db.query(Incident).filter(Incident.id_projet == id_projet).first() is not None

        resultats.append({
            "id": id_projet,
            "nom": projet.name,
            "localisation": projet.adresse,
            "profondeur": profondeur,
            "dateDebut": projet.date_debut.strftime("%d/%m/%Y") if projet.date_debut else None,
            "coutPrevu": f"{projet.budget_total:,} DA" if projet.budget_total else "0 DA",
            "coutActuel": f"{cout_reel:,} DA",
            "delaiPrevu": f"{projet.duree_prevue} jours" if projet.duree_prevue else "N/A",
            "delaiEcoule": f"{delai_ecoule} jours",
            "closed": projet.closed,
            "hasIncident": has_incident,
        })

    return resultats
