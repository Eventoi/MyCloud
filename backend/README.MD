# ☁️ My Cloud — установка Backend (Django + PostgreSQL)

## 📝 Описание проекта
Это веб-приложение на Django, предназначенное для хранения и управления файлами пользователей. Включает систему авторизации, REST API и поддержку CORS для frontend

---

## 📘 Содержание
1. [Требования](#-требования)
2. [Структура backend-проекта](#-структура-backend-проекта)
3. [Установка и настройка](#%EF%B8%8F-установка-и-настройка)
4. [Запуск сервера](#-запуск-сервера)

---

## 💻 Требования
| Компонент | Версия | Примечание |
|-----|-----|-----|
| Python | [3.14](https://www.python.org/ftp/python/3.14.0/python-3.14.0-amd64.exe) | Установлен и добавлен в PATH. Основной язык программирования |
| PostgreSQL | [18](https://sbp.enterprisedb.com/getfile.jsp?fileid=1259779) | Установлена и добавлена в PATH. Основная база данных |
| Django | 5.2.7 | Основной фреймворк для создания веб-приложений на Python |
| Django Rest Framework | 3.16.1 | Расширение для Django: создание REST API |
| Django Cors Headers | 4.9.0 | Расширение для Django: поддержка CORS (разрешение запросов к Django с других источников) |
| Gunicorn | 23.0.0 | WSGI-сервер, используется для запуска Django-приложения в продакшене ("мост" между веб-сервером и Python-приложением) |
| Pillow | [12.0.0](https://pillow.readthedocs.io/en/stable/) | Библиотека, для работы с изображениями |
| Psycopg2 Binary | 2.9.11 | Драйвер PostgreSQL для Python/Django |
| Python Decouple | 3.8 | Работа с .env-файлами для безопасного хранения настроек |

---

## 📁 Структура backend-проекта
```
..\mycloud\backend\
|
├─ media\				# Файлы пользователей
├─ mycloud\				# Основа Django-проекта
│  ├── __init__.py			# Делает папку модулем Python
│  ├── asgi.py				# Точка входа для асинхронного сервера
│  ├── settings.py			# Основной файл настроек Django
│  ├── urls.py				# Центральный маршрутизатор проекта
│  └── wsgi.py				# Точка входа для обычного веб-сервера
│
├─ storage\				# Файловое хранилище
│  ├── __init__.py			# Делает папку модулем Python
│  ├── models.py			# Описывает таблицу с файлами (имя, размер, комментарий, дата загрузки, путь к файлу и т.д.)
│  ├── serializers.py		# Указывает, какие поля файлов передаются между Django и frontend (JSON)
│  ├── urls.py				# Маршруты для API-хранилища
│  └── views.py				# Основная логика API для работы с файлами (загрузка, переименование, удаление, скачивание, генерация ссылок)
│
├─ users\				# Управление пользователями и авторизацией
|   ├── __init__.py			# Делает папку модулем Python
|   ├── admin.py			# Регистрирует модели пользователей в стандартной админке Django
|   ├── models.py			# Описывает таблицу пользователей в базе данных
|   ├── serializers.py		# Определяет, какие поля пользователей передаются через API (JSON)
|   ├── urls.py				# Маршруты для всех функций views.py
|   └── views.py			# Логика API для регистрации, логина, выхода, получения и удаления пользователей
|
├─ .env					# Хранит все конфиденциальные настройки
├─ manage.py			# Главный управляющий файл Django
├─ README.md			# Документация проекта
└─ requirements.txt		# Список библиотек Python, которые нужны для работы проекта
```

---

## ⚙️ Установка и настройка

### 1️⃣ Вход в папку проекта
```bash
cd backend
```

### 2️⃣ Установка и настройка виртуального окружения
```bash
python -m venv .venv
.venv\Scripts\activate
```

### 3️⃣ Установка зависимостей
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4️⃣ Настройка PostgreSQL
```bash
$env:PGPASSWORD="ваш_пароль_пользователя_postgres"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE ROLE mycloud_user WITH LOGIN PASSWORD 'dbpass123';"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE mycloud_db OWNER mycloud_user;"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE mycloud_db TO mycloud_user;"
```

### 5️⃣ Генерация SECRET_KEY
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 6️⃣ Создание файла `.env`
Файл .env добавлен в репозиторий для удобства проверки работоспособности, так как в нем отсутствуют чувствительные данные и находятся только тестовые

> [!IMPORTANT]
> Так делать категорически не рекомендуется! Файл .env должен храниться локально!

Что необходимо сделать на данном этапе:
1. Скопировать сгенерированный SECRET_KEY из 5 шага
2. Открыть файл .env любым текстовым редактором, вставить скопированный ключ в соответствующее поле и сохранить
3. Открыть [.gitignore](/.gitignore) любым текстовым редактором, раскомментировать строчку с .env-файлом и сохранить

В [settings.py](/backend/mycloud/settings.py) уже прописан подхват SECRET_KEY

---

## 🚀 Запуск сервера
```bash
python manage.py makemigrations users
python manage.py makemigrations storage
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

➡️ [http://127.0.0.1:8000/](http://127.0.0.1:8000/) — главная страница  
➡️ [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) — админ-панель

---

## ✅ Готово!
После выполнения всех шагов сервер Django будет запущен. Теперь можно перейти к [frontend](/frontend/README.MD) и соединить их через API