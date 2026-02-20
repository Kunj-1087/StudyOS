"""
studyOS Backend Server
Academic Intelligence System API
"""
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Any
import uuid
from datetime import datetime, timezone, timedelta
from enum import Enum

# Local imports
from auth import (
    verify_password, get_password_hash, create_access_token, 
    decode_token, UserRegister, UserLogin, Token, UserResponse,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from seed_data import DOMAINS_DATA, RESOURCES_DATA

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Check if Supabase is configured
DATABASE_URL = os.environ.get('DATABASE_URL')
USE_SUPABASE = DATABASE_URL is not None

# In-memory storage fallback (when Supabase not configured)
# This allows the app to run in demo mode
users_db = {}
domains_db = {}
resources_db = {}
user_progress_db = {}
personal_plan_db = {}

# Initialize domains from seed data
def init_seed_data():
    for domain_data in DOMAINS_DATA:
        domain_id = str(uuid.uuid4())
        domains_db[domain_id] = {
            "id": domain_id,
            **domain_data,
            "is_active": True,
            "display_order": DOMAINS_DATA.index(domain_data),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        # Add resources for this domain
        slug = domain_data["slug"]
        if slug in RESOURCES_DATA:
            for idx, res in enumerate(RESOURCES_DATA[slug]):
                res_id = str(uuid.uuid4())
                resources_db[res_id] = {
                    "id": res_id,
                    "domain_id": domain_id,
                    **res,
                    "upvotes": 0,
                    "view_count": 0,
                    "is_verified": True,
                    "is_active": True,
                    "display_order": idx,
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }

init_seed_data()

# FastAPI App
app = FastAPI(title="studyOS API", version="1.0.0")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# Pydantic Models
class UserRole(str, Enum):
    STUDENT = "student"
    CONTRIBUTOR = "contributor"
    ADMIN = "admin"

class ResourceType(str, Enum):
    VIDEO = "video"
    ARTICLE = "article"
    COURSE = "course"
    BOOK = "book"
    TOOL = "tool"
    PROJECT = "project"
    COMMUNITY = "community"

class ResourceCategory(str, Enum):
    FOUNDATION = "foundation"
    CORE_STACK = "core_stack"
    ADVANCED = "advanced"
    PROJECTS = "projects"
    INDUSTRY_EXPOSURE = "industry_exposure"

class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class DomainResponse(BaseModel):
    id: str
    slug: str
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None
    market_demand: int = 0
    difficulty_index: int = 0
    time_to_competency: Optional[str] = None
    avg_salary_min: Optional[int] = None
    avg_salary_max: Optional[int] = None
    salary_currency: str = "USD"
    overview: Optional[str] = None
    why_it_matters: Optional[str] = None
    core_concepts: Optional[List[str]] = None
    required_skills: Optional[List[dict]] = None
    tool_stack: Optional[List[dict]] = None
    industry_applications: Optional[List[str]] = None
    execution_strategy: Optional[List[dict]] = None
    is_active: bool = True

class ResourceResponse(BaseModel):
    id: str
    domain_id: str
    title: str
    description: Optional[str] = None
    url: str
    resource_type: str
    category: str
    difficulty: str
    provider: Optional[str] = None
    duration: Optional[str] = None
    is_free: bool = True
    thumbnail_url: Optional[str] = None
    upvotes: int = 0
    view_count: int = 0
    is_verified: bool = False

class UserProgressResponse(BaseModel):
    domain_id: str
    domain_name: str
    completion_percentage: float = 0.0
    resources_completed: List[str] = []
    started_at: Optional[str] = None
    last_activity: Optional[str] = None

class PersonalPlanAdd(BaseModel):
    resource_id: str

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    avatar_url: Optional[str] = None

# Auth dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials is None:
        return None
    
    token_data = decode_token(credentials.credentials)
    if token_data is None:
        return None
    
    user = users_db.get(token_data.user_id)
    return user

async def require_auth(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token_data = decode_token(credentials.credentials)
    if token_data is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = users_db.get(token_data.user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

# Routes
@api_router.get("/")
async def root():
    return {"message": "studyOS API v1.0", "status": "operational"}

@api_router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "supabase" if USE_SUPABASE else "in-memory",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# Auth Routes
@api_router.post("/auth/register", response_model=Token)
async def register(data: UserRegister):
    # Check if user exists
    for user in users_db.values():
        if user["email"] == data.email:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    user = {
        "id": user_id,
        "email": data.email,
        "password_hash": get_password_hash(data.password),
        "name": data.name,
        "avatar_url": None,
        "role": "student",
        "auth_provider": "email",
        "skill_index": 0.0,
        "reputation_score": 0,
        "contribution_count": 0,
        "execution_score": 0.0,
        "created_at": now,
        "updated_at": now,
        "last_login": now
    }
    
    users_db[user_id] = user
    
    # Create token
    token = create_access_token({
        "user_id": user_id,
        "email": data.email,
        "role": "student"
    })
    
    return Token(
        access_token=token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@api_router.post("/auth/login", response_model=Token)
async def login(data: UserLogin):
    # Find user
    user = None
    for u in users_db.values():
        if u["email"] == data.email:
            user = u
            break
    
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Update last login
    user["last_login"] = datetime.now(timezone.utc).isoformat()
    
    # Create token
    token = create_access_token({
        "user_id": user["id"],
        "email": user["email"],
        "role": user["role"]
    })
    
    return Token(
        access_token=token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@api_router.get("/auth/me")
async def get_me(user: dict = Depends(require_auth)):
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "avatar_url": user.get("avatar_url"),
        "role": user["role"],
        "skill_index": user.get("skill_index", 0),
        "reputation_score": user.get("reputation_score", 0),
        "contribution_count": user.get("contribution_count", 0),
        "execution_score": user.get("execution_score", 0),
        "created_at": user["created_at"]
    }

@api_router.put("/auth/profile")
async def update_profile(data: UserProfileUpdate, user: dict = Depends(require_auth)):
    if data.name:
        user["name"] = data.name
    if data.avatar_url:
        user["avatar_url"] = data.avatar_url
    user["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    return {"message": "Profile updated", "user": user}

# Domain Routes
@api_router.get("/domains", response_model=List[DomainResponse])
async def get_domains():
    domains = [d for d in domains_db.values() if d.get("is_active", True)]
    domains.sort(key=lambda x: x.get("display_order", 0))
    return domains

@api_router.get("/domains/{slug}", response_model=DomainResponse)
async def get_domain(slug: str):
    for domain in domains_db.values():
        if domain["slug"] == slug:
            return domain
    raise HTTPException(status_code=404, detail="Domain not found")

# Resource Routes
@api_router.get("/domains/{slug}/resources", response_model=List[ResourceResponse])
async def get_domain_resources(slug: str, category: Optional[str] = None):
    # Find domain
    domain = None
    for d in domains_db.values():
        if d["slug"] == slug:
            domain = d
            break
    
    if domain is None:
        raise HTTPException(status_code=404, detail="Domain not found")
    
    # Get resources
    resources = [r for r in resources_db.values() 
                 if r["domain_id"] == domain["id"] and r.get("is_active", True)]
    
    if category:
        resources = [r for r in resources if r.get("category") == category]
    
    resources.sort(key=lambda x: x.get("display_order", 0))
    return resources

@api_router.get("/resources/{resource_id}", response_model=ResourceResponse)
async def get_resource(resource_id: str):
    resource = resources_db.get(resource_id)
    if resource is None:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    # Increment view count
    resource["view_count"] = resource.get("view_count", 0) + 1
    return resource

@api_router.post("/resources/{resource_id}/upvote")
async def upvote_resource(resource_id: str, user: dict = Depends(require_auth)):
    resource = resources_db.get(resource_id)
    if resource is None:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    resource["upvotes"] = resource.get("upvotes", 0) + 1
    return {"message": "Upvoted", "upvotes": resource["upvotes"]}

# User Progress Routes
@api_router.get("/progress", response_model=List[UserProgressResponse])
async def get_user_progress(user: dict = Depends(require_auth)):
    user_id = user["id"]
    progress_list = []
    
    for key, progress in user_progress_db.items():
        if progress["user_id"] == user_id:
            domain = domains_db.get(progress["domain_id"])
            if domain:
                progress_list.append({
                    "domain_id": progress["domain_id"],
                    "domain_name": domain["name"],
                    "completion_percentage": progress.get("completion_percentage", 0),
                    "resources_completed": progress.get("resources_completed", []),
                    "started_at": progress.get("started_at"),
                    "last_activity": progress.get("last_activity")
                })
    
    return progress_list

@api_router.post("/progress/{domain_slug}/start")
async def start_domain(domain_slug: str, user: dict = Depends(require_auth)):
    # Find domain
    domain = None
    for d in domains_db.values():
        if d["slug"] == domain_slug:
            domain = d
            break
    
    if domain is None:
        raise HTTPException(status_code=404, detail="Domain not found")
    
    user_id = user["id"]
    progress_key = f"{user_id}_{domain['id']}"
    
    if progress_key not in user_progress_db:
        now = datetime.now(timezone.utc).isoformat()
        user_progress_db[progress_key] = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "domain_id": domain["id"],
            "completion_percentage": 0.0,
            "resources_completed": [],
            "started_at": now,
            "last_activity": now
        }
    
    return {"message": "Domain started", "progress": user_progress_db[progress_key]}

@api_router.post("/progress/{domain_slug}/complete-resource/{resource_id}")
async def complete_resource(domain_slug: str, resource_id: str, user: dict = Depends(require_auth)):
    # Find domain
    domain = None
    for d in domains_db.values():
        if d["slug"] == domain_slug:
            domain = d
            break
    
    if domain is None:
        raise HTTPException(status_code=404, detail="Domain not found")
    
    # Verify resource belongs to domain
    resource = resources_db.get(resource_id)
    if resource is None or resource["domain_id"] != domain["id"]:
        raise HTTPException(status_code=404, detail="Resource not found in domain")
    
    user_id = user["id"]
    progress_key = f"{user_id}_{domain['id']}"
    
    if progress_key not in user_progress_db:
        now = datetime.now(timezone.utc).isoformat()
        user_progress_db[progress_key] = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "domain_id": domain["id"],
            "completion_percentage": 0.0,
            "resources_completed": [],
            "started_at": now,
            "last_activity": now
        }
    
    progress = user_progress_db[progress_key]
    
    if resource_id not in progress["resources_completed"]:
        progress["resources_completed"].append(resource_id)
        
        # Calculate completion percentage
        total_resources = len([r for r in resources_db.values() if r["domain_id"] == domain["id"]])
        if total_resources > 0:
            progress["completion_percentage"] = (len(progress["resources_completed"]) / total_resources) * 100
        
        progress["last_activity"] = datetime.now(timezone.utc).isoformat()
        
        # Update user stats
        user["skill_index"] = user.get("skill_index", 0) + 0.5
        user["execution_score"] = user.get("execution_score", 0) + 1.0
    
    return {"message": "Resource completed", "progress": progress}

# Personal Plan Routes
@api_router.get("/personal-plan")
async def get_personal_plan(user: dict = Depends(require_auth)):
    user_id = user["id"]
    plan_items = []
    
    for key, item in personal_plan_db.items():
        if item["user_id"] == user_id:
            resource = resources_db.get(item["resource_id"])
            if resource:
                plan_items.append({
                    **item,
                    "resource": resource
                })
    
    return plan_items

@api_router.post("/personal-plan/add")
async def add_to_plan(data: PersonalPlanAdd, user: dict = Depends(require_auth)):
    resource = resources_db.get(data.resource_id)
    if resource is None:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    user_id = user["id"]
    plan_key = f"{user_id}_{data.resource_id}"
    
    if plan_key in personal_plan_db:
        raise HTTPException(status_code=400, detail="Already in plan")
    
    now = datetime.now(timezone.utc).isoformat()
    personal_plan_db[plan_key] = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "resource_id": data.resource_id,
        "is_completed": False,
        "notes": None,
        "priority": 0,
        "added_at": now
    }
    
    return {"message": "Added to plan", "item": personal_plan_db[plan_key]}

@api_router.delete("/personal-plan/{resource_id}")
async def remove_from_plan(resource_id: str, user: dict = Depends(require_auth)):
    user_id = user["id"]
    plan_key = f"{user_id}_{resource_id}"
    
    if plan_key not in personal_plan_db:
        raise HTTPException(status_code=404, detail="Item not in plan")
    
    del personal_plan_db[plan_key]
    return {"message": "Removed from plan"}

@api_router.put("/personal-plan/{resource_id}/complete")
async def complete_plan_item(resource_id: str, user: dict = Depends(require_auth)):
    user_id = user["id"]
    plan_key = f"{user_id}_{resource_id}"
    
    if plan_key not in personal_plan_db:
        raise HTTPException(status_code=404, detail="Item not in plan")
    
    personal_plan_db[plan_key]["is_completed"] = True
    personal_plan_db[plan_key]["completed_at"] = datetime.now(timezone.utc).isoformat()
    
    return {"message": "Completed", "item": personal_plan_db[plan_key]}

# User Stats (for profile)
@api_router.get("/user/stats")
async def get_user_stats(user: dict = Depends(require_auth)):
    user_id = user["id"]
    
    # Calculate domain completion
    domain_stats = []
    for domain in domains_db.values():
        progress_key = f"{user_id}_{domain['id']}"
        progress = user_progress_db.get(progress_key)
        if progress:
            domain_stats.append({
                "domain_id": domain["id"],
                "domain_name": domain["name"],
                "domain_slug": domain["slug"],
                "completion": progress.get("completion_percentage", 0)
            })
    
    # Calculate activity (simplified)
    activity_data = []
    for i in range(7):
        day = datetime.now(timezone.utc) - timedelta(days=i)
        activity_data.append({
            "date": day.strftime("%Y-%m-%d"),
            "activity": len(domain_stats) * (7 - i)  # Simplified activity metric
        })
    
    return {
        "skill_index": user.get("skill_index", 0),
        "reputation_score": user.get("reputation_score", 0),
        "contribution_count": user.get("contribution_count", 0),
        "execution_score": user.get("execution_score", 0),
        "domains_started": len(domain_stats),
        "domain_progress": domain_stats,
        "activity": activity_data[::-1]
    }

# Include router
app.include_router(api_router)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup():
    logger.info("studyOS API starting up...")
    logger.info(f"Database mode: {'Supabase' if USE_SUPABASE else 'In-memory (demo mode)'}")
    logger.info(f"Loaded {len(domains_db)} domains, {len(resources_db)} resources")
