from sqlalchemy import Column, Integer, String, Date, ForeignKey, Numeric, CheckConstraint, CLOB, BLOB
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class Operation(Base):
    __tablename__ = "operation"

    id = Column(Integer, primary_key=True)
    designation = Column(String(100))
    categorie = Column(String(20))
    __table_args__ = (CheckConstraint("categorie IN ('Fixe', 'Variable')"),)


class Utilisateur(Base):
    __tablename__ = "utilisateur"

    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    email = Column(String(100)) 
    pwd = Column(String(100))
    role = Column(String(20))
    __table_args__ = (CheckConstraint("role IN ('Admin', 'Decideur','Agent')"),)


class Projet(Base):
    __tablename__ = "projet"

    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    date_debut = Column(Date)
    type= Column(String(500))  
    created_by = Column(Integer, ForeignKey('utilisateur.id'))
    lieu = Column(String(100))
    budget_total = Column(Numeric(15, 2))
    duree_prevue = Column(Integer)
    wilaya = Column(String(100))
    adresse = Column(String(100))
    closed = Column(String(20))
    __table_args__ = (CheckConstraint("closed IN ('True', 'False')"),)


class UserProjet(Base):
    __tablename__ = "user_projet"

    id_projet = Column(Integer, ForeignKey('projet.id'), primary_key=True)
    id_utilisateur = Column(Integer, ForeignKey('utilisateur.id'), primary_key=True)


class Phase(Base):
    __tablename__ = "phase"

    id = Column(Integer, primary_key=True)
    designation = Column(CLOB)


class RapportJournalier(Base):
    __tablename__ = "rapport_journalier"

    id = Column(Integer, primary_key=True)
    id_projet = Column(Integer, ForeignKey('projet.id'))
    date_rapport = Column(Date)
    daily_cost = Column(Numeric(15, 2))
    commentaire = Column(CLOB)
    profondeur = Column(Numeric(19))
    fichier_excel = Column(BLOB)
    userid = Column(Integer, ForeignKey('utilisateur.id'))
    phase = Column(Integer, ForeignKey('phase.id'))


class OperationJournaliere(Base):
    __tablename__ = "operation_journaliere"

    id = Column(Integer, primary_key=True)
    id_rapport = Column(Integer, ForeignKey('rapport_journalier.id'))
    id_operation = Column(Integer, ForeignKey('operation.id'))
    description = Column(String(200))
    cout = Column(Numeric(15, 2))
    probleme = Column(CLOB)
    solution = Column(CLOB)
    fichier_joint = Column(BLOB)


class PrevisionOperation(Base):
    __tablename__ = "prevision_operation"

    id = Column(Integer, primary_key=True)
    id_projet = Column(Integer, ForeignKey('projet.id'))
    id_operation = Column(Integer, ForeignKey('operation.id'))
    cout_prevu = Column(Numeric(15, 2))
    delais = Column(Integer)


class PrevisionPhase(Base):
    __tablename__ = "prevision_phase"

    id = Column(Integer, primary_key=True)
    id_projet = Column(Integer, ForeignKey('projet.id'))
    id_phase = Column(Integer, ForeignKey('phase.id'))
    cout_prevu = Column(Numeric(15, 2))
    delais = Column(Integer)
    profondeur = Column(Numeric(19))
# comment

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True)
    id_projet = Column(Integer, ForeignKey('projet.id'))
    description = Column(String(500))  
    date_incident = Column(Date)
    fichier_joint = Column(BLOB)
    id_utilisateur = Column(Integer, ForeignKey('utilisateur.id'))
    resolu = Column(String(1), default='N')
