from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api/v1"
    
    DATABASE_URL: str
    REDIS_URL: str 
    GEMINI_API_KEY: str
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()