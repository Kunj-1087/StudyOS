"""
studyOS Backend Server
Academic Intelligence System API — powered by supabase-py (HTTPS)
"""
from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import uuid
from pathlib import Path
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from enum import Enum

# Local imports
from auth import (
    verify_password, get_password_hash, create_access_token,
    decode_token, UserRegister, UserLogin, Token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from database import get_supabase, is_database_configured
from seed_data import DOMAINS_DATA, RESOURCES_DATA

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

USE_SUPABASE = is_database_configured()

# ── In-memory fallback (demo mode) ──────────────────────────────────────────
users_db = {}
domains_db = {}
resources_db = {}
user_progress_db = {}
personal_plan_db = {}

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

# ── FastAPI App ──────────────────────────────────────────────────────────────
app = FastAPI(title="studyOS API", version="1.0.0")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# ── Pydantic Models ──────────────────────────────────────────────────────────
class UserRole(str, Enum):
    STUDENT = "student"
    CONTRIBUTOR = "contributor"
    ADMIN = "admin"

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

# ── Helpers ──────────────────────────────────────────────────────────────────
def now_iso():
    return datetime.now(timezone.utc).isoformat()

# ── Auth Dependency ──────────────────────────────────────────────────────────
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials is None:
        return None
    token_data = decode_token(credentials.credentials)
    if token_data is None:
        return None
    if USE_SUPABASE:
        try:
            sb = get_supabase()
            res = sb.table("users").select("*").eq("id", token_data.user_id).single().execute()
            return res.data
        except Exception:
            return None
    return users_db.get(token_data.user_id)

async def require_auth(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token_data = decode_token(credentials.credentials)
    if token_data is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    if USE_SUPABASE:
        try:
            sb = get_supabase()
            res = sb.table("users").select("*").eq("id", token_data.user_id).single().execute()
            if not res.data:
                raise HTTPException(status_code=401, detail="User not found")
            return res.data
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=401, detail="Auth error")
    user = users_db.get(token_data.user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ── Routes ───────────────────────────────────────────────────────────────────
@api_router.get("/")
async def root():
    return {"message": "studyOS API v1.0", "status": "operational"}

@api_router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "supabase" if USE_SUPABASE else "in-memory (demo)",
        "timestamp": now_iso()
    }

# ── Auth Routes ──────────────────────────────────────────────────────────────
@api_router.post("/auth/register", response_model=Token)
async def register(data: UserRegister, current_user: Optional[dict] = Depends(get_current_user)):
    try:
        # If we already have a current_user (from Supabase token), use its ID
        pre_existing_id = current_user.get("id") if current_user else None
        
        if USE_SUPABASE:
            sb = get_supabase()
            logger.info(f"Attempting registration/sync for email: {data.email}")
            
            # Check existing explicitly by email
            existing = sb.table("users").select("*").eq("email", data.email).execute()
            if existing.data:
                # If it already exists, just return a token for it
                user = existing.data[0]
                token = create_access_token({"user_id": user["id"], "email": user["email"], "role": user.get("role", "student")})
                return Token(access_token=token, token_type="bearer", expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60)
            
            # Otherwise create new record. Use pre_existing_id from Supabase token if available.
            user_id = pre_existing_id or str(uuid.uuid4())
            now = now_iso()
            user_row = {
                "id": user_id,
                "email": data.email,
                "password_hash": get_password_hash(data.password),
                "name": data.name,
                "avatar_url": None,
                "role": "student",
                "auth_provider": "supabase" if pre_existing_id else "email",
                "skill_index": 0.0,
                "reputation_score": 0,
                "contribution_count": 0,
                "execution_score": 0.0,
                "created_at": now,
                "updated_at": now,
                "last_login": now
            }
            logger.info(f"Inserting user record for {data.email} with ID: {user_id}")
            sb.table("users").insert(user_row).execute()
        else:
            # In-memory fallback
            for u in users_db.values():
                if u["email"] == data.email:
                    raise HTTPException(status_code=400, detail="Email already registered")
            user_id = pre_existing_id or str(uuid.uuid4())
            now = now_iso()
            users_db[user_id] = {
                "id": user_id, "email": data.email,
                "password_hash": get_password_hash(data.password),
                "name": data.name, "avatar_url": None, "role": "student",
                "auth_provider": "email", "skill_index": 0.0,
                "reputation_score": 0, "contribution_count": 0,
                "execution_score": 0.0, "created_at": now,
                "updated_at": now, "last_login": now
            }
            
        token = create_access_token({"user_id": user_id, "email": data.email, "role": "student"})
        return Token(access_token=token, token_type="bearer", expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {e}", exc_info=True)
        # Obfuscate internal error details for security
        raise HTTPException(status_code=500, detail="Internal Server Error during registration")

@api_router.post("/auth/login", response_model=Token)
async def login(data: UserLogin):
    try:
        user = None
        if USE_SUPABASE:
            sb = get_supabase()
            res = sb.table("users").select("*").eq("email", data.email).execute()
            if res.data:
                user = res.data[0]
        else:
            for u in users_db.values():
                if u["email"] == data.email:
                    user = u
                    break

        if user is None or not verify_password(data.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Update last login
        if USE_SUPABASE:
            get_supabase().table("users").update({"last_login": now_iso()}).eq("id", user["id"]).execute()
        else:
            users_db[user["id"]]["last_login"] = now_iso()

        token = create_access_token({"user_id": user["id"], "email": user["email"], "role": user["role"]})
        return Token(access_token=token, token_type="bearer", expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}", exc_info=True)
        # Obfuscate internal error details for security
        raise HTTPException(status_code=500, detail="Internal Server Error during login")

@api_router.get("/auth/me")
async def get_me(user: dict = Depends(require_auth)):
    return {
        "id": user["id"], "email": user["email"], "name": user["name"],
        "avatar_url": user.get("avatar_url"), "role": user["role"],
        "skill_index": user.get("skill_index", 0),
        "reputation_score": user.get("reputation_score", 0),
        "contribution_count": user.get("contribution_count", 0),
        "execution_score": user.get("execution_score", 0),
        "created_at": user["created_at"]
    }

@api_router.put("/auth/profile")
async def update_profile(data: UserProfileUpdate, user: dict = Depends(require_auth)):
    updates = {"updated_at": now_iso()}
    if data.name:
        updates["name"] = data.name
    if data.avatar_url:
        updates["avatar_url"] = data.avatar_url
    if USE_SUPABASE:
        get_supabase().table("users").update(updates).eq("id", user["id"]).execute()
    else:
        users_db[user["id"]].update(updates)
    return {"message": "Profile updated"}

# ── Domain Routes ────────────────────────────────────────────────────────────
@api_router.get("/domains", response_model=List[DomainResponse])
async def get_domains():
    try:
        if USE_SUPABASE:
            sb = get_supabase()
            logger.info("Fetching domains from Supabase...")
            res = sb.table("domains").select("*").eq("is_active", True).order("display_order").execute()
            logger.info(f"Successfully fetched {len(res.data or [])} domains from Supabase")
            return res.data or []
        
        logger.info("Fetching domains from in-memory store...")
        domains = [d for d in domains_db.values() if d.get("is_active", True)]
        domains.sort(key=lambda x: x.get("display_order", 0))
        return domains
    except Exception as e:
        logger.error(f"Error in get_domains: {str(e)}", exc_info=True)
        # Fallback to in-memory if Supabase fails (if we have seed data)
        if domains_db:
             logger.warning("Falling back to in-memory domains due to error")
             domains = [d for d in domains_db.values() if d.get("is_active", True)]
             domains.sort(key=lambda x: x.get("display_order", 0))
             return domains
        raise HTTPException(status_code=500, detail="Internal server error while fetching domains")

@api_router.get("/domains/{slug}", response_model=DomainResponse)
async def get_domain(slug: str):
    if USE_SUPABASE:
        sb = get_supabase()
        res = sb.table("domains").select("*").eq("slug", slug).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Domain not found")
        return res.data[0]
    for domain in domains_db.values():
        if domain["slug"] == slug:
            return domain
    raise HTTPException(status_code=404, detail="Domain not found")

# ── Resource Routes ──────────────────────────────────────────────────────────
@api_router.get("/domains/{slug}/resources", response_model=List[ResourceResponse])
async def get_domain_resources(slug: str, category: Optional[str] = None):
    if USE_SUPABASE:
        sb = get_supabase()
        # Get domain first
        dom = sb.table("domains").select("id").eq("slug", slug).execute()
        if not dom.data:
            raise HTTPException(status_code=404, detail="Domain not found")
        dom.data = dom.data[0]  # normalise to single object
        query = sb.table("resources").select("*").eq("domain_id", dom.data["id"]).eq("is_active", True)  # type: ignore
        if category:
            query = query.eq("category", category)
        res = query.order("display_order").execute()
        return res.data or []

    domain = next((d for d in domains_db.values() if d["slug"] == slug), None)
    if not domain:
        raise HTTPException(status_code=404, detail="Domain not found")
    resources = [r for r in resources_db.values()
                 if r["domain_id"] == domain["id"] and r.get("is_active", True)]
    if category:
        resources = [r for r in resources if r.get("category") == category]
    resources.sort(key=lambda x: x.get("display_order", 0))
    return resources

@api_router.get("/resources/{resource_id}", response_model=ResourceResponse)
async def get_resource(resource_id: str):
    if USE_SUPABASE:
        sb = get_supabase()
        res = sb.table("resources").select("*").eq("id", resource_id).single().execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Resource not found")
        sb.table("resources").update({"view_count": (res.data.get("view_count", 0) + 1)}).eq("id", resource_id).execute()
        return res.data
    resource = resources_db.get(resource_id)
    if resource is None:
        raise HTTPException(status_code=404, detail="Resource not found")
    resource["view_count"] = resource.get("view_count", 0) + 1
    return resource

@api_router.post("/resources/{resource_id}/upvote")
async def upvote_resource(resource_id: str, user: dict = Depends(require_auth)):
    if USE_SUPABASE:
        sb = get_supabase()
        res = sb.table("resources").select("upvotes").eq("id", resource_id).single().execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Resource not found")
        new_count = (res.data.get("upvotes", 0) + 1)
        sb.table("resources").update({"upvotes": new_count}).eq("id", resource_id).execute()
        return {"message": "Upvoted", "upvotes": new_count}
    resource = resources_db.get(resource_id)
    if resource is None:
        raise HTTPException(status_code=404, detail="Resource not found")
    resource["upvotes"] = resource.get("upvotes", 0) + 1
    return {"message": "Upvoted", "upvotes": resource["upvotes"]}

# ── User Progress Routes ─────────────────────────────────────────────────────
@api_router.get("/progress", response_model=List[UserProgressResponse])
async def get_user_progress(user: dict = Depends(require_auth)):
    if USE_SUPABASE:
        sb = get_supabase()
        res = sb.table("user_progress").select("*, domains(name)").eq("user_id", user["id"]).execute()
        return [
            {
                "domain_id": p["domain_id"],
                "domain_name": p.get("domains", {}).get("name", ""),
                "completion_percentage": p.get("completion_percentage", 0),
                "resources_completed": p.get("resources_completed", []),
                "started_at": p.get("started_at"),
                "last_activity": p.get("last_activity")
            }
            for p in (res.data or [])
        ]
    user_id = user["id"]
    result = []
    for progress in user_progress_db.values():
        if progress["user_id"] == user_id:
            domain = domains_db.get(progress["domain_id"])
            if domain:
                result.append({
                    "domain_id": progress["domain_id"],
                    "domain_name": domain["name"],
                    "completion_percentage": progress.get("completion_percentage", 0),
                    "resources_completed": progress.get("resources_completed", []),
                    "started_at": progress.get("started_at"),
                    "last_activity": progress.get("last_activity")
                })
    return result

@api_router.post("/progress/{domain_slug}/start")
async def start_domain(domain_slug: str, user: dict = Depends(require_auth)):
    if USE_SUPABASE:
        sb = get_supabase()
        dom = sb.table("domains").select("id").eq("slug", domain_slug).single().execute()
        if not dom.data:
            raise HTTPException(status_code=404, detail="Domain not found")
        domain_id = dom.data["id"]
        existing = sb.table("user_progress").select("id").eq("user_id", user["id"]).eq("domain_id", domain_id).execute()
        if not existing.data:
            now = now_iso()
            row = {
                "id": str(uuid.uuid4()), "user_id": user["id"], "domain_id": domain_id,
                "completion_percentage": 0.0, "resources_completed": [],
                "started_at": now, "last_activity": now
            }
            sb.table("user_progress").insert(row).execute()
            return {"message": "Domain started", "progress": row}
        return {"message": "Already started"}

    domain = next((d for d in domains_db.values() if d["slug"] == domain_slug), None)
    if not domain:
        raise HTTPException(status_code=404, detail="Domain not found")
    key = f"{user['id']}_{domain['id']}"
    if key not in user_progress_db:
        now = now_iso()
        user_progress_db[key] = {
            "id": str(uuid.uuid4()), "user_id": user["id"], "domain_id": domain["id"],
            "completion_percentage": 0.0, "resources_completed": [],
            "started_at": now, "last_activity": now
        }
    return {"message": "Domain started", "progress": user_progress_db[key]}

@api_router.post("/progress/{domain_slug}/complete-resource/{resource_id}")
async def complete_resource(domain_slug: str, resource_id: str, user: dict = Depends(require_auth)):
    if USE_SUPABASE:
        sb = get_supabase()
        dom = sb.table("domains").select("id").eq("slug", domain_slug).single().execute()
        if not dom.data:
            raise HTTPException(status_code=404, detail="Domain not found")
        domain_id = dom.data["id"]
        # Get or create progress
        prog_res = sb.table("user_progress").select("*").eq("user_id", user["id"]).eq("domain_id", domain_id).execute()
        now = now_iso()
        if not prog_res.data:
            progress = {
                "id": str(uuid.uuid4()), "user_id": user["id"], "domain_id": domain_id,
                "completion_percentage": 0.0, "resources_completed": [resource_id],
                "started_at": now, "last_activity": now
            }
            sb.table("user_progress").insert(progress).execute()
        else:
            progress = prog_res.data[0]
            completed = progress.get("resources_completed") or []
            if resource_id not in completed:
                completed.append(resource_id)
                total = sb.table("resources").select("id", count="exact").eq("domain_id", domain_id).execute()
                pct = (len(completed) / total.count * 100) if total.count else 0
                sb.table("user_progress").update({
                    "resources_completed": completed,
                    "completion_percentage": pct,
                    "last_activity": now
                }).eq("id", progress["id"]).execute()
                progress["resources_completed"] = completed
                progress["completion_percentage"] = pct
        return {"message": "Resource completed", "progress": progress}

    domain = next((d for d in domains_db.values() if d["slug"] == domain_slug), None)
    if not domain:
        raise HTTPException(status_code=404, detail="Domain not found")
    resource = resources_db.get(resource_id)
    if resource is None or resource["domain_id"] != domain["id"]:
        raise HTTPException(status_code=404, detail="Resource not found in domain")
    key = f"{user['id']}_{domain['id']}"
    now = now_iso()
    if key not in user_progress_db:
        user_progress_db[key] = {
            "id": str(uuid.uuid4()), "user_id": user["id"], "domain_id": domain["id"],
            "completion_percentage": 0.0, "resources_completed": [],
            "started_at": now, "last_activity": now
        }
    progress = user_progress_db[key]
    if resource_id not in progress["resources_completed"]:
        progress["resources_completed"].append(resource_id)
        total = len([r for r in resources_db.values() if r["domain_id"] == domain["id"]])
        if total:
            progress["completion_percentage"] = (len(progress["resources_completed"]) / total) * 100
        progress["last_activity"] = now
    return {"message": "Resource completed", "progress": progress}

# ── Personal Plan Routes ─────────────────────────────────────────────────────
@api_router.get("/personal-plan")
async def get_personal_plan(user: dict = Depends(require_auth)):
    if USE_SUPABASE:
        sb = get_supabase()
        res = sb.table("personal_plan_items").select("*, resources(*)").eq("user_id", user["id"]).execute()
        return res.data or []
    user_id = user["id"]
    return [
        {**item, "resource": resources_db.get(item["resource_id"])}
        for item in personal_plan_db.values()
        if item["user_id"] == user_id
    ]

@api_router.post("/personal-plan/add")
async def add_to_plan(data: PersonalPlanAdd, user: dict = Depends(require_auth)):
    if USE_SUPABASE:
        sb = get_supabase()
        res_check = sb.table("resources").select("id").eq("id", data.resource_id).execute()
        if not res_check.data:
            raise HTTPException(status_code=404, detail="Resource not found")
        existing = sb.table("personal_plan_items").select("id").eq("user_id", user["id"]).eq("resource_id", data.resource_id).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Already in plan")
        row = {
            "id": str(uuid.uuid4()), "user_id": user["id"], "resource_id": data.resource_id,
            "is_completed": False, "notes": None, "priority": 0, "added_at": now_iso()
        }
        sb.table("personal_plan_items").insert(row).execute()
        return {"message": "Added to plan", "item": row}
    resource = resources_db.get(data.resource_id)
    if resource is None:
        raise HTTPException(status_code=404, detail="Resource not found")
    key = f"{user['id']}_{data.resource_id}"
    if key in personal_plan_db:
        raise HTTPException(status_code=400, detail="Already in plan")
    row = {
        "id": str(uuid.uuid4()), "user_id": user["id"], "resource_id": data.resource_id,
        "is_completed": False, "notes": None, "priority": 0, "added_at": now_iso()
    }
    personal_plan_db[key] = row
    return {"message": "Added to plan", "item": row}

@api_router.delete("/personal-plan/{resource_id}")
async def remove_from_plan(resource_id: str, user: dict = Depends(require_auth)):
    if USE_SUPABASE:
        sb = get_supabase()
        sb.table("personal_plan_items").delete().eq("user_id", user["id"]).eq("resource_id", resource_id).execute()
        return {"message": "Removed from plan"}
    key = f"{user['id']}_{resource_id}"
    if key not in personal_plan_db:
        raise HTTPException(status_code=404, detail="Item not in plan")
    del personal_plan_db[key]
    return {"message": "Removed from plan"}

@api_router.put("/personal-plan/{resource_id}/complete")
async def complete_plan_item(resource_id: str, user: dict = Depends(require_auth)):
    now = now_iso()
    if USE_SUPABASE:
        sb = get_supabase()
        sb.table("personal_plan_items").update({"is_completed": True, "completed_at": now}).eq("user_id", user["id"]).eq("resource_id", resource_id).execute()
        return {"message": "Completed"}
    key = f"{user['id']}_{resource_id}"
    if key not in personal_plan_db:
        raise HTTPException(status_code=404, detail="Item not in plan")
    personal_plan_db[key]["is_completed"] = True
    personal_plan_db[key]["completed_at"] = now
    return {"message": "Completed", "item": personal_plan_db[key]}

# ── User Stats ───────────────────────────────────────────────────────────────
@api_router.get("/user/stats")
async def get_user_stats(user: dict = Depends(require_auth)):
    if USE_SUPABASE:
        sb = get_supabase()
        prog_res = sb.table("user_progress").select("*, domains(name, slug)").eq("user_id", user["id"]).execute()
        domain_stats = [
            {
                "domain_id": p["domain_id"],
                "domain_name": p.get("domains", {}).get("name", ""),
                "domain_slug": p.get("domains", {}).get("slug", ""),
                "completion": p.get("completion_percentage", 0)
            }
            for p in (prog_res.data or [])
        ]
    else:
        user_id = user["id"]
        domain_stats = []
        for domain in domains_db.values():
            key = f"{user_id}_{domain['id']}"
            progress = user_progress_db.get(key)
            if progress:
                domain_stats.append({
                    "domain_id": domain["id"], "domain_name": domain["name"],
                    "domain_slug": domain["slug"],
                    "completion": progress.get("completion_percentage", 0)
                })

    activity_data = [
        {"date": (datetime.now(timezone.utc) - timedelta(days=i)).strftime("%Y-%m-%d"),
         "activity": len(domain_stats) * (7 - i)}
        for i in range(7)
    ]

    return {
        "skill_index": user.get("skill_index", 0),
        "reputation_score": user.get("reputation_score", 0),
        "contribution_count": user.get("contribution_count", 0),
        "execution_score": user.get("execution_score", 0),
        "domains_started": len(domain_stats),
        "domain_progress": domain_stats,
        "activity": activity_data[::-1]
    }

# ── Assemble app ─────────────────────────────────────────────────────────────
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    logger.info("studyOS API starting up...")
    logger.info(f"Database mode: {'Supabase (HTTPS)' if USE_SUPABASE else 'In-memory (demo mode)'}")
    if not USE_SUPABASE:
        logger.info(f"Loaded {len(domains_db)} domains, {len(resources_db)} resources (in-memory)")
