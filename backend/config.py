# backend\config.py
import os
from dotenv import load_dotenv
from datetime import timedelta


load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    DATABASE_URL = os.getenv('DATABASE_URL')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)

    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    S3_BUCKET = os.getenv('S3_BUCKET')
    S3_REGION = os.getenv('S3_REGION')
    STRIPE_API_KEY = os.getenv('STRIPE_API_KEY')
    FRONTEND_URL = os.getenv('FRONTEND_URL')

    
    # JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=30)
    # JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
