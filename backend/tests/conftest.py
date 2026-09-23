from collections.abc import Generator
from importlib import import_module

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

upgrade = import_module("app.db.migrations.001_init").upgrade


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    upgrade(engine)
    with Session(engine) as session:
        yield session
    engine.dispose()
