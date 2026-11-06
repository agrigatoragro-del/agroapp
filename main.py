from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import models
from database import engine
from routers import users, ads
app.include_router(ads.router, prefix="/api/ads")

# Создаем таблицы в базе данных при запуске
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Agro-Marketplace KZ")

# Подключаем папку со статическими файлами (HTML, JS, CSS)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Подключаем все эндпоинты пользователей и админки из routers/users.py
app.include_router(users.router)

# Главная страница (отдает index.html)
from fastapi.responses import FileResponse

@app.get("/")
def read_index():
    return FileResponse("static/index.html")
