from fastapi import FastAPI
from routers import utilisateur

app = FastAPI()

app.include_router(utilisateur.router, tags=["Utilisateur"])

