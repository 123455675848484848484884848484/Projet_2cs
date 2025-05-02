from fastapi import FastAPI
from routers import utilisateur, insertion_bdd,auth,operation,phase,previsions,projet
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

