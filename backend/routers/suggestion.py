from fastapi import FastAPI ,APIRouter , Depends
from sqlalchemy.orm import Session, sessionmaker
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine
from database import get_db
from  models import OperationJournaliere  
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
router = APIRouter(prefix="/suggest", tags=["Suggest"])


class ProblemRequest(BaseModel):
    description: str
    top_k: int = 3  # nombre de résultats à retourner

# Modèle de la réponse
class SolutionResponse(BaseModel):
    probleme: str
    solution: str
    similarite: float

@router.post("/", response_model=List[SolutionResponse])
def suggest_solution(request: ProblemRequest, db: Session = Depends(get_db)):
    ops = db.query(OperationJournaliere).all()

    problemes = []
    solutions = []

    for op in ops:
        if op.probleme and op.solution:
            problemes.append(str(op.probleme))
            solutions.append(str(op.solution))

    if not problemes:
        return []

    # Vectorisation TF-IDF
    vectorizer = TfidfVectorizer()
    try:
        tfidf_matrix = vectorizer.fit_transform(problemes + [request.description])
        similarities = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])[0]
    except Exception as e:
        print("Erreur TF-IDF :", str(e))
        return []

    # Top K
    top_indices = np.argsort(similarities)[::-1][:request.top_k]

    results = []
    for idx in top_indices:
        results.append(SolutionResponse(
            probleme=problemes[idx],
            solution=solutions[idx],
            similarite=round(float(similarities[idx]), 3)
        ))

    return results
