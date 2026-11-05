from database import SessionLocal
from models import User

@app.get("/make-me-admin-now")
def make_me_admin():
    db = SessionLocal()
    # Получаем вообще всех пользователей из базы данных
    all_users = db.query(User).all()
    
    if not all_users:
        db.close()
        return {"status": "error", "message": "База данных полностью пуста! На сайте еще никто не регистрировался."}
    
    # Берем самого последнего зарегистрированного пользователя
    user = all_users[-1]
    user.is_admin = True
    db.commit()
    
    # Собираем список всех, кто есть в базе, чтобы вы сразу увидели, кто нашелся
    users_list = [{"id": u.id, "phone": u.phone, "name": u.name, "is_admin": u.is_admin} for u in all_users]
    db.close()
    
    return {
        "status": "success",
        "message": f"Успешно назначен админом аккаунт ID {user.id} ({user.phone} - {user.name})!",
        "all_users_in_database": users_list
    }
