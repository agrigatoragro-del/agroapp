from database import SessionLocal
from models import User

db = SessionLocal()

target_phone = "77774777278"
user = db.query(User).filter(User.phone == target_phone).first()

if user:
    user.is_admin = True
    db.commit()
    print(f"Успешно! Пользователь {user.name or user.phone} (ID: {user.id}) назначен администратором.")
else:
    print(f"Пользователь с номером {target_phone} не найден в базе. Сначала зарегистрируйтесь под этим номером на сайте.")

db.close()
