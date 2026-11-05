from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Путь к локальному файлу базы данных SQLite
SQLALCHEMY_DATABASE_URL = "sqlite:///./agro_market.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# Функция-зависимость для получения сессии БД в эндпоинтах
def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()
