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
