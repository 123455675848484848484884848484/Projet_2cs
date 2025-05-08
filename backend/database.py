from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker , declarative_base

# Remplace par ta vraie URL Oracle
DATABASE_URL = "oracle+oracledb://SYSTEM:loveyourself1@localhost:1522/?service_name=XE"


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()