from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import json
import os

from database import SessionLocal, engine
import models

# Сначала создаем экземпляр app!
app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_index():
    return FileResponse("static/index.html")

# --- ВРЕМЕННЫЙ ЭНДПОИНТ ДЛЯ НАЗНАЧЕНИЯ АДМИНИСТРАТОРА ---
@app.get("/make-me-admin-now")
def make_me_admin():
    db = SessionLocal()
    all_users = db.query(models.User).all()
    
    if not all_users:
        db.close()
        return {"status": "error", "message": "В базе пока нет пользователей. Зарегистрируйтесь на сайте!"}
    
    # Берем последнего зарегистрированного пользователя
    user = all_users[-1]
    user.is_admin = True
    db.commit()
    
    users_list = [{"id": u.id, "phone": u.phone, "name": u.name, "is_admin": u.is_admin} for u in all_users]
    db.close()
    
    return {
        "status": "success",
        "message": f"Успешно! Пользователь {user.phone} ({user.name}) теперь Администратор!",
        "all_users_in_database": users_list
    }
# --------------------------------------------------------

# (Здесь находятся ваши остальные роутеры и эндпоинты для объявлений и пользователей)
