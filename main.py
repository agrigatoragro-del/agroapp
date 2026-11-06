from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database import engine
import models
import os

from routers import users, ads

# Создаем таблицы в БД
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Agro-Marketplace KZ")

# Подключаем статические файлы
app.mount("/static", StaticFiles(directory="static"), name="static")

# Подключаем роутеры
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(ads.router, prefix="/api/ads", tags=["Ads"])

@app.get("/")
def read_index():
    return FileResponse("static/index.html")

# Временный эндпоинт для мгновенного получения прав админа
@app.get("/make-me-admin-now")
def make_me_admin():
    from database import SessionLocal
    db = SessionLocal()
    all_users = db.query(models.User).all()
    if not all_users:
        db.close()
        return {"status": "error", "message": "В базе пока нет пользователей. Сначала зарегистрируйтесь на сайте!"}
    
    user = all_users[-1]
    user.is_admin = True
    db.commit()
    db.close()
    return {"status": "success", "message": f"Пользователь {user.phone} ({user.name}) теперь Администратор!"}
