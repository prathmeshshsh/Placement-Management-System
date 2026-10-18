"""Application settings for the Placement Management API.

The backend .env file is resolved relative to this file, not the process's
current working directory. This lets the API be launched from either the
backend directory or the repository root without silently losing settings.
"""

from functools import lru_cache
from pathlib import Path

from pydantic import SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BACKEND_DIR / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    app_env: str = "development"
    database_url: SecretStr
    jwt_secret: SecretStr
    jwt_issuer: str = "placement-management"
    jwt_audience: str = "placement-management-api"
    access_token_minutes: int = 10
    refresh_token_days: int = 14
    cors_origins: str = "http://localhost:5173"
    cookie_secure: bool = True
    cookie_samesite: str = "strict"
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_password: SecretStr | None = None
    smtp_from: str = "no-reply@example.edu"
    invitation_base_url: str = "https://example.edu/register"

    @field_validator("jwt_secret")
    @classmethod
    def validate_secret(cls, value: SecretStr) -> SecretStr:
        if len(value.get_secret_value().encode("utf-8")) < 32:
            raise ValueError("JWT_SECRET must be at least 32 bytes")
        return value

    @field_validator("access_token_minutes", "refresh_token_days")
    @classmethod
    def validate_positive_lifetimes(cls, value: int) -> int:
        if value <= 0:
            raise ValueError("Token lifetime settings must be greater than zero")
        return value

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip().rstrip("/") for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
