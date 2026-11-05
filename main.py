from fastapi import FastAPI
import uvicorn
from database import engine, Base
import models
from routers import ads

# Автоматическое создание таблиц при старте
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Agro Marketplace API", version="1.0")

# Подключаем модуль объявлений
app.include_router(ads.router)

@app.get("/")
def read_root():
    return {"status": "online", "message": "Агро-маркетплейс работает стабильно!"}

@app.get("/ping")
def keep_alive():
    """Для UptimeRobot против засыпания Render"""
    return {"ping": "pong"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
