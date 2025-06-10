from fastapi import FastAPI
from routers import auth,operation,phase,previsions,projet,insertion_bdd,utilisateur, globaldash , suggestion , incident, rapports
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(utilisateur.router, tags=["Utilisateur"])
app.include_router(insertion_bdd.router,tags=["fichier_excel"])

app.include_router(auth.router,tags=["Authentification"] )
app.include_router(operation.router,tags=["operation"] )
app.include_router(phase.router,tags=["phase"])
app.include_router(previsions.router,tags=["prévisions"])
app.include_router(projet.router,tags=["projet"])
app.include_router(incident.router,tags=["incident"])
app.include_router(suggestion.router,tags=["suggest"])
app.include_router(globaldash.router,tags=["globaldash"])
app.include_router(rapports.router,tags=["rapports"])


