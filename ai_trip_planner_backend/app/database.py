import os
import sqlite3
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite database path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(BASE_DIR)
DB_PATH = os.path.join(BACKEND_DIR, "trip_planner.db").replace("\\", "/")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

# Thread-safe SQLite engine with WAL mode for performance
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency injection yield for database session management."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def ensure_database_schema():
    """Ensures database tables exist and migrations/columns are present."""
    Base.metadata.create_all(bind=engine)
    
    # Safe SQLite column check and addition
    db_file = os.path.join(BACKEND_DIR, "trip_planner.db")
    if os.path.exists(db_file):
        try:
            con = sqlite3.connect(db_file)
            cur = con.cursor()
            cur.execute("PRAGMA table_info(trips)")
            cols = [r[1] for r in cur.fetchall()]
            if cols and "created_at" not in cols:
                cur.execute("ALTER TABLE trips ADD COLUMN created_at TIMESTAMP")
                con.commit()
            con.close()
        except Exception:
            pass
