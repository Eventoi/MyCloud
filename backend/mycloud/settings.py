import os
from pathlib import Path
from decouple import config, Csv

# Базовая директория проекта
BASE_DIR = Path(__file__).resolve().parent.parent

# Секретный ключ
SECRET_KEY = config('SECRET_KEY')

# Отладка
DEBUG = config('DEBUG', default=True, cast=bool)

# Разрешённые хосты
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='', cast=Csv())

# Пользовательская модель
AUTH_USER_MODEL = 'users.MyUser'

# Установка приложений
INSTALLED_APPS = [
    # Стандартные Django-приложения
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Сторонние библиотеки
    'rest_framework',
    'corsheaders',

    # Собственные приложения
    'users',
    'storage',
]

# Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # должен быть первым для CORS
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]

# Корневой URLconf
ROOT_URLCONF = 'mycloud.urls'

# Templates (папка templates не используется, DIRS пустой)
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI
WSGI_APPLICATION = 'mycloud.wsgi.application'

# БД PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASS'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# Статические и медиафайлы
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

# (Опционально) раздача React build (если будет через Django)
# STATICFILES_DIRS = [
#     os.path.join(BASE_DIR, '../frontend/build/static'),
# ]

# Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
}

# CORS
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='', cast=Csv())
CORS_ALLOW_CREDENTIALS = True
CORS_URLS_REGEX = r"^/api/.*$" # API-эндпоинты будут доступны для внешних JS-запросов, а админка/статик — нет
CSRF_TRUSTED_ORIGINS = ['http://127.0.0.1:3000']

# Логирование
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'simple': {'format': '%(asctime)s [%(levelname)s] %(message)s'}
    },
    'handlers': {
        'console': {'class': 'logging.StreamHandler', 'formatter': 'simple'}
    },
    'root': {'handlers': ['console'], 'level': 'INFO'},
}

# Убрать предупреждения Django
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'