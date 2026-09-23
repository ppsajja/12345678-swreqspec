from sqlalchemy.engine import Engine

from app.db.models import Base


def upgrade(engine: Engine) -> None:
    # รองรับ CON-TECH-01, IF-HIS-01 และ DOM-PDPA-01 ด้วยการสร้าง schema หลักของการจอง
    Base.metadata.create_all(engine)
