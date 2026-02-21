"""
Authentication utilities for studyOS.
Supports JWT-based auth and OAuth.
"""
from datetime import datetime, timedelta, timezone
from typing import Optional
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
import os

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'studyos-super-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Password hashing (using pbkdf2_sha256 to avoid bcrypt's 72-byte limit and Windows issues)
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# Pydantic Models
class TokenData(BaseModel):
    user_id: str
    email: str
    role: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    avatar_url: Optional[str] = None
    role: str
    skill_index: float
    reputation_score: int
    contribution_count: int
    execution_score: float
    created_at: datetime
    
    class Config:
        from_attributes = True

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> Optional[TokenData]:
    """Decode and validate a JWT token (supports both local and Supabase)."""
    try:
        # 1. Try local JWT first
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return TokenData(
            user_id=payload.get("user_id"),
            email=payload.get("email"),
            role=payload.get("role", "student")
        )
    except JWTError:
        # 2. Fallback: Try verifying as a Supabase token
        try:
            from database import get_supabase
            sb = get_supabase()
            user_res = sb.auth.get_user(token)
            if user_res and user_res.user:
                return TokenData(
                    user_id=user_res.user.id,
                    email=user_res.user.email,
                    role="student" # Default role for Supabase users
                )
        except Exception as e:
            import logging
            logging.getLogger(__name__).error(f"Supabase token verification failed: {e}")
            pass
        return None
