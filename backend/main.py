from fastapi import FastAPI
from routers import auth,operation,phase,previsions,projet,insertion_bdd,utilisateur, globaldash
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 👈 React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(utilisateur.router, tags=["Utilisateur"])
app.include_router(insertion_bdd.router_extraction,tags=["extraction"])
app.include_router(insertion_bdd.router_recup,tags=["recuperation"])
app.include_router(insertion_bdd.router_probleme,tags=["probleme"])
app.include_router(insertion_bdd.router_incident,tags=["incident"])
app.include_router(insertion_bdd.router_operation_journaliere,tags=["op_journaliere"])
app.include_router(auth.router,tags=["Authentification"] )
app.include_router(operation.router,tags=["operation"] )
app.include_router(phase.router,tags=["phase"])
app.include_router(previsions.router,tags=["prévisions"])
app.include_router(projet.router,tags=["projet"])
app.include_router(projet.router,tags=["globaldash"])
app.include_router(globaldash.router_user_projet,tags=["delais_projets"])

