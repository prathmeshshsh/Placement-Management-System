from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from app.core.config import get_settings
engine=create_engine(get_settings().database_url.get_secret_value(),pool_pre_ping=True,pool_recycle=1800)
SessionLocal=sessionmaker(bind=engine,autoflush=False,expire_on_commit=False,class_=Session)
def get_db():
    db=SessionLocal()
    try: yield db
    finally: db.close()
