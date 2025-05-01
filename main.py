from fastapi import FastAPI
from routers import utilisateur
from routers import insertion_bdd

app = FastAPI()

app.include_router(utilisateur.router, tags=["Utilisateur"])
app.include_router(insertion_bdd.router_extraction,tags=["extraction"])
app.include_router(insertion_bdd.router_recup,tags=["recuperation"])
app.include_router(insertion_bdd.router_probleme,tags=["probleme"])
app.include_router(insertion_bdd.router_incident,tags=["incident"])

