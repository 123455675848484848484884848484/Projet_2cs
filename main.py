from fastapi import FastAPI
from routers import utilisateur
from routers import insertion_bdd
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

