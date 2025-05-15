from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from sqlalchemy import asc, func
from database import get_db
from models import Projet, UserProjet, Utilisateur , PrevisionPhase ,RapportJournalier , Incident
from pys_models import ProjetCreate, ProjetOut,AffectationCreate
from datetime import timedelta
from datetime import date , datetime


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
def get_resume_projet(projet_id: int, db: Session = Depends(get_db)):
    # 1. Récupération du projet
    projet = db.query(Projet).filter(Projet.id == projet_id).first()
    if not projet:
        raise HTTPException(status_code=404, detail="Projet non trouvé")

    # 2. Dates estimées et retard (à adapter à ton contexte)
    date_debut = projet.date_debut
    date_fin_previsionnelle = projet.date_debut + timedelta(days=projet.duree_prevue)
    date_aujourdhui = datetime.now().date()

    # Exemple de retard simple
    retard_total = max(0, (date_aujourdhui - date_fin_previsionnelle).days)
    date_fin_estimee = date_fin_previsionnelle + timedelta(days=retard_total)

    # 3. Calcul du coût prévisionnel depuis PrevisionPhase
    cout_previsionnel = db.query(func.coalesce(func.sum(PrevisionPhase.cout_prevu), 0))\
        .filter(PrevisionPhase.id_projet == projet_id)\
        .scalar()

    # 4. Calcul du coût réel depuis RapportJournalier
    cout_reel = db.query(func.coalesce(func.sum(RapportJournalier.daily_cost), 0))\
        .filter(RapportJournalier.id_projet == projet_id)\
        .scalar()

    return {
        "projet": projet.name,
        "adresse": projet.adresse,
        "date_prevue": date_fin_previsionnelle,
        "date_estimee": date_fin_estimee,
        "jours_restants": (date_fin_estimee - datetime.now().date()).days,
        "cout_previsionnel": float(cout_previsionnel),
        "cout_reel":float(cout_reel),
        "montant_restant":max(0, float(cout_previsionnel) - float(cout_reel))
    }

@router.get("/{projet_id}/prof_date")
def profondeur_cumulative_délais(projet_id: int , db: Session = Depends(get_db)):
     
    projet = db.query(Projet).filter(Projet.id == projet_id).first()
    if not projet:
        raise HTTPException(status_code=404, detail="Projet non trouvé")

    previsions = db.query(PrevisionPhase)\
                   .filter(PrevisionPhase.id_projet == projet_id)\
                   .order_by(PrevisionPhase.id).all()

    if not previsions:
        raise HTTPException(status_code=404, detail="Aucune prévision trouvée pour ce projet.")
    
    projet = db.query(Projet.date_debut).filter(Projet.id == projet_id).first()
    if projet is None:
        raise Exception("Project not found.")
        
    date_debut_projet = projet.date_debut
    cumul_jours = 0
    progression = [{"profondeur": 0.0, "date": date_debut_projet}]

    for prevision in previsions:
        cumul_jours += prevision.delais or 0
        date_attendue = projet.date_debut + timedelta(days=cumul_jours)

        progression.append({
            "profondeur": float(prevision.profondeur or 0),
            "date": date_attendue.strftime("%Y-%m-%d")
        })

    return progression


@router.get("/{projet_id}/prof_cout")
def profondeur_cumulative_cout(projet_id: int , db: Session = Depends(get_db)):
    previsions = db.query(PrevisionPhase)\
                   .filter(PrevisionPhase.id_projet == projet_id)\
                   .order_by(PrevisionPhase.id).all()

    if not previsions:
        raise HTTPException(status_code=404, detail="Aucune prévision trouvée pour ce projet.")

    cumul_cout = 0.0
    progression = [{"cout_cumule": 0.0, "profondeur": 0.0}]

    for p in previsions:
        profondeur = float(p.profondeur) if p.profondeur is not None else 0.0
        cout = float(p.cout_prevu) if p.cout_prevu is not None else 0.0

        cumul_cout += cout

        progression.append({
            "cout_cumule": round(cumul_cout, 2),
            "profondeur": round(profondeur, 2)
        })

    return progression




@router.get("/{projet_id}/prof_cout_realite")
def get_cout_cumule_sans_date_unique(projet_id: int, db: Session = Depends(get_db)):
    try:
        rapports = (
            db.query(
                RapportJournalier.daily_cost,
                RapportJournalier.profondeur
            )
            .filter(RapportJournalier.id_projet == projet_id)
            .order_by(RapportJournalier.date_rapport)
            .all()
        )

        cout_cumule = 0.0
        profondeur_map = dict()

        for rapport in rapports:
            cout = float(rapport.daily_cost or 0.0)
            profondeur = float(rapport.profondeur or 0.0)
            cout_cumule += cout

            # Garder uniquement la profondeur si elle est nouvelle
            # ou si le coût cumulé est plus élevé
            if profondeur not in profondeur_map or cout_cumule > profondeur_map[profondeur]["cout"]:
                profondeur_map[profondeur] = {
                    "cout": round(cout_cumule, 2),
                    "profondeur": profondeur
                }

        # Étape 2 : Ajouter ligne initiale (0,0) et trier par profondeur
        resultat = [{"cout": 0.0, "profondeur": 0.0}] + sorted(
            profondeur_map.values(), key=lambda x: x["profondeur"]
        )

        return resultat

    except Exception as e:
        import traceback
        print(f"Erreur : {str(e)}")
        print(traceback.format_exc())
        return {"error": "Une erreur est survenue, veuillez réessayer plus tard."}




@router.get("/{projet_id}/prof_date_realite")
def get_profondeur_par_date(projet_id: int, db: Session = Depends(get_db)):
    try:
        # Étape 1 : Récupérer les profondeurs max par date depuis les rapports
        rapports = (
            db.query(
                RapportJournalier.date_rapport.label("date"),
                func.max(RapportJournalier.profondeur).label("profondeur")
            )
            .filter(RapportJournalier.id_projet == projet_id)
            .group_by(RapportJournalier.date_rapport)
            .order_by(RapportJournalier.date_rapport)
            .all()
        )

        # Étape 2 : Récupérer les incidents
        incidents = (
            db.query(Incident.date_incident.label("date"))
            .filter(Incident.id_projet == projet_id)
            .order_by(Incident.date_incident)
            .all()
        )

        # Étape 3 : Récupérer la date de début du projet
        projet = db.query(Projet.date_debut).filter(Projet.id == projet_id).first()
        if projet is None:
            raise Exception("Projet introuvable.")
        date_debut_projet = projet.date_debut

        
        resultat_dict = {}

       
        resultat_dict[date_debut_projet] = {"date": date_debut_projet, "profondeur": 0.0, "incident": False}

        
        for r in rapports:
            date = r.date
            profondeur = float(r.profondeur or 0.0)
            if date not in resultat_dict or profondeur > resultat_dict[date]["profondeur"]:
                resultat_dict[date] = {"date": date, "profondeur": profondeur, "incident": False}

        
        for inc in incidents:
            date_incident = inc.date

            
            if date_incident not in resultat_dict:
               
                prof_avant = (
                    db.query(RapportJournalier.profondeur)
                    .filter(RapportJournalier.id_projet == projet_id,
                            RapportJournalier.date_rapport <= date_incident)
                    .order_by(RapportJournalier.date_rapport.desc())
                    .limit(1)
                    .scalar()
                )

               
                prof_apres = (
                    db.query(RapportJournalier.profondeur)
                    .filter(RapportJournalier.id_projet == projet_id,
                            RapportJournalier.date_rapport >= date_incident)
                    .order_by(RapportJournalier.date_rapport.asc())
                    .limit(1)
                    .scalar()
                )

                if prof_avant is not None and prof_apres is not None:
                    profondeur = (float(prof_avant) + float(prof_apres)) / 2.0
                elif prof_avant is not None:
                    profondeur = float(prof_avant)
                elif prof_apres is not None:
                    profondeur = float(prof_apres)
                else:
                    profondeur = 0.0

                resultat_dict[date_incident] = {
                    "date": date_incident,
                    "profondeur": profondeur,
                    "incident": True
                }

            else:
                # Marquer comme incident si déjà présent
                resultat_dict[date_incident]["incident"] = True

        # Étape 7 : Trier par date et convertir en liste
        resultat = [
            {
                "date": date.isoformat(),
                "profondeur": info["profondeur"],
                "incident": info["incident"]
            }
            for date, info in sorted(resultat_dict.items())
        ]

        return resultat

    except Exception as e:
        import traceback
        print(f"Erreur : {str(e)}")
        print(traceback.format_exc())
        return {"error": "Une erreur est survenue, veuillez réessayer plus tard."}
