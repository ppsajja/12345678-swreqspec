import os

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://booking:booking@localhost:5432/booking",
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, class_=Session, expire_on_commit=False)


def get_db() -> Session:
    # รองรับ CON-TECH-01 โดยเปิด session ผ่าน DATABASE_URL สำหรับ PostgreSQL ในระบบจริง
    return SessionLocal()
