
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer , OAuth2PasswordRequestForm
from passlib.context import CryptContext 
from models import Utilisateur
from pys_models import UtilisateurCreate , UtilisateurOut
from database import get_db
from sqlalchemy.orm import Session
from jose import jwt , JWTError
from datetime import timedelta ,  datetime
from fastapi import FastAPI, Path, Depends ,HTTPException,APIRouter, status
from fastapi.responses import JSONResponse

router =  APIRouter(prefix="/auth", tags=["Authentification"])

oauth2_schema = OAuth2PasswordBearer(tokenUrl="token")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


SECRET_KEY = "xWgDCm9vtlW_hA4MP0gIpXzghEwvJyzAYKQtaY_Y0bI"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def get_user_by_mail(mail: str, db: Session = Depends(get_db)):
    return db.query(Utilisateur).filter(Utilisateur.email == mail).first()

def create_user(db: Session, user: UtilisateurCreate):
    hashed_pwd = pwd_context.hash(user.pwd)
    db_user = Utilisateur(
        name=user.name,
        email=user.email,
        pwd=hashed_pwd,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user) 
    return db_user



def authenticate_user(mail: str, password: str, db: Session):
    user = db.query(Utilisateur).filter(Utilisateur.email == mail).first()
    if not user:
        return False
    if not pwd_context.verify(password, user.pwd):
        return False
    return user

# Create access token
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    
    # Si expires_delta est défini, utiliser la valeur passée
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        # Sinon, utiliser une expiration par défaut de 15 minutes
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str = Depends(oauth2_schema)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=403, detail="Token is invalid or expired")
        return payload
    except JWTError:
        raise HTTPException(status_code=403, detail="Token is invalid or expired")


@router.post("/register")
def register_user(user: UtilisateurCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_mail(user.email, db)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    new_user = create_user(db=db, user=user)
    return {"id": new_user.id}

# Authenticate the user


@router.post("/token")
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    try:
        user = authenticate_user(form_data.username, form_data.password, db)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        print("✅ User authenticated:", user.email, "| Role:", user.role)

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email, "role": user.role},
            expires_delta=access_token_expires
        )

        return JSONResponse(
        content={
            "access_token": access_token,
            "token_type": "bearer",  
            "user_id": user.id,
            "role": user.role
        }
    )

    except Exception as e:
        print("❌ ERREUR DANS /token :", str(e))
        raise HTTPException(status_code=500, detail="Erreur interne: " + str(e))

@router.get("/verify_token/{token}")
async def verify_user_token(token: str):
    verify_token(token=token)
    return {"message": "Token is valid"}