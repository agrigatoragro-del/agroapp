from fastapi import FastAPI
from database import engine, Base
import models
from routers import ads, verification, users

# Создаем таблицы в базе данных при старте
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kazakhstan B2B Agro-Marketplace",
    description="Платформа для агро-предприятий, техники и ангаров с системой верификации и монетизации",
    version="1.0.0",
)

# Подключаем все наши роутеры разом
app.include_router(ads.router)
app.include_router(verification.router)
app.include_router(users.router)

@app.get("/")
def read_root():
    return {
        "status": "active",
        "message": "API Агро-Маркетплейса Казахстана успешно работает!"
    }
