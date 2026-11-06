from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import json
import os
import shutil

router = APIRouter(tags=["ads"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_ads(admin_view: bool = False, db: Session = Depends(get_db)):
    if admin_view:
        # Для модерации отдаем только те, которые НЕ одобрены (is_approved == False)
        return db.query(models.Ad).filter(models.Ad.is_approved == False).order_by(models.Ad.id.desc()).all()
    
    # Для обычного сайта — только одобренные
    return db.query(models.Ad).filter(models.Ad.is_approved == True).order_by(models.Ad.id.desc()).all()
    
@router.post("/")
async def create_ad(
    title: str = Form(...),
    category: str = Form(...),
    location: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    phone: str = Form(...),
    user_id: int = Form(...),
    images: list[UploadFile] = File(default=[]),
    db: Session = Depends(get_db)
):
    image_urls = []
    os.makedirs("static/uploads", exist_ok=True)
    for img in images:
        file_path = f"static/uploads/{img.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(img.file, buffer)
        image_urls.append(f"/{file_path}")  # Получится ровно "/static/uploads/имя_файла.jpg"

    new_ad = models.Ad(
        title=title,
        category=category,
        location=location,
        description=description,
        price=price,
        phone=phone,
        user_id=user_id,
        images_json=json.dumps(image_urls),
        is_approved=False
    )
    db.add(new_ad)
    db.commit()
    db.refresh(new_ad)
    return new_ad

@router.post("/{ad_id}/approve")
def approve_ad(ad_id: int, db: Session = Depends(get_db)):
    ad = db.query(models.Ad).filter(models.Ad.id == ad_id).first()
    if not ad:
        raise HTTPException(status_code=404, detail="Объявление не найдено")
    ad.is_approved = True
    db.commit()
    return {"status": "approved"}

@router.delete("/{ad_id}")
def delete_ad(ad_id: int, db: Session = Depends(get_db)):
    ad = db.query(models.Ad).filter(models.Ad.id == ad_id).first()
    if not ad:
        raise HTTPException(status_code=404, detail="Объявление не найдено")
    db.delete(ad)
    db.commit()
    return {"status": "deleted"}
