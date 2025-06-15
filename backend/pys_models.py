from pydantic import BaseModel
from typing import Optional
from datetime import date


# -------------------- OPERATION --------------------
class OperationCreate(BaseModel):
    designation: str
    categorie: str

class OperationOut(OperationCreate):
    id: int

    class Config:
        from_attribute = True


# -------------------- UTILISATEUR --------------------
class UtilisateurCreate(BaseModel):
    name: str
    email: str
    pwd: str
    role: str

class UtilisateurOut(UtilisateurCreate):
    id: int

    class Config:
        from_attribute = True


# -------------------- PROJET --------------------
class ProjetCreate(BaseModel):
    name: str 
    date_debut: date
    type : str
    created_by: int
    lieu: str
    budget_total: float
    duree_prevue: int
    wilaya: str
    adresse: str
    closed: str

class ProjetOut(ProjetCreate):
    id: int

    class Config:
        from_attribute = True


# -------------------- USER_PROJET --------------------
class UserProjetCreate(BaseModel):
    id_projet: int
    id_utilisateur: int

class UserProjetOut(UserProjetCreate):
    class Config:
        from_attributes = True


# -------------------- PHASE --------------------
class PhaseCreate(BaseModel):
    designation: str

class PhaseOut(PhaseCreate):
    id: int

    class Config:
        from_attributes = True


# -------------------- RAPPORT JOURNALIER --------------------
class RapportJournalierCreate(BaseModel):
    id_projet: int
    date_rapport: date
    daily_cost: float
    commentaire: Optional[str]
    profondeur: float
    fichier_excel: Optional[bytes]
    userid: int
    phase: int

class RapportJournalierOut(RapportJournalierCreate):
    id: int
    id_projet: int
    date_rapport: date
    daily_cost: float
    commentaire: str | None
    profondeur: float | None
    userid: int | None
    phase: int | None

    class Config:
        orm_mode = True


# -------------------- OPERATION JOURNALIERE --------------------
class OperationJournaliereCreate(BaseModel):
    id_rapport: int
    id_operation: int
    description: str
    cout: float
    probleme: Optional[str]
    solution: Optional[str]
    fichier_joint: Optional[bytes]

class OperationJournaliereOut(OperationJournaliereCreate):
    id: int

    class Config:
        from_attribute = True


# -------------------- PREVISION OPERATION --------------------
class PrevisionOperationCreate(BaseModel):
    
    id_operation : int
    cout_prevu: float
    delais: int

class PrevisionOperationOut(PrevisionOperationCreate):
    id: int

    class Config:
       from_attribute = True


# -------------------- PREVISION PHASE --------------------
class PrevisionPhaseCreate(BaseModel):
    id_phase: int
    cout_prevu: float
    delais: int
    profondeur: float

class PrevisionPhaseOut(PrevisionPhaseCreate):
    id: int

    class Config:
        from_attribute = True


# -------------------- INCIDENT --------------------
class IncidentCreate(BaseModel):
    id_projet: int
    id_utilisateur: int
    date_incident: date
    fichier_joint: Optional[bytes]
    resolu: str
    description: Optional[str] = None  

class IncidentOut(IncidentCreate):
    id: int

    class Config:
        from_attribute = True 
#----------------- Affecter agent a un projet --------------------------------------
class AffectationCreate(BaseModel):
    id_utilisateur: int
    id_projet: int