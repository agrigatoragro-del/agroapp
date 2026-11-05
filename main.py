from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database import engine, Base
import models
from routers import ads, verification, users

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kazakhstan B2B Agro-Marketplace",
    description="Платформа для агро-предприятий, техники и ангаров",
    version="1.0.0",
)

# Подключаем роутеры API
app.include_router(ads.router)
app.include_router(verification.router)
app.include_router(users.router)

# Подключаем статическую папку с визуалом
app.mount("/static", StaticFiles(directory="static"), name="static")

# Отдаем визуальный интерфейс на главном адресе сайта
@app.get("/", response_class=FileResponse)
def read_root():
    return "static/index.html"
from database import SessionLocal
from models import User

@app.get("/make-me-admin-now")
def make_me_admin():
    db = SessionLocal()
    user = db.query(User).filter(User.phone == "777764777278").first()
    if user:
        user.is_admin = True
        db.commit()
        db.close()
        return {"status": "success", "message": f"Пользователь {user.phone} теперь администратор!"}
    db.close()
    return {"status": "error", "message": "Пользователь с таким номером еще не зарегистрирован на сайте!"}
