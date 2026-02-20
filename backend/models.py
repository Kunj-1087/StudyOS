"""
SQLAlchemy models for studyOS database schema.
Production-ready with proper indexing and relationships.
"""
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone
import uuid
import enum

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

# Enums
class UserRole(enum.Enum):
    STUDENT = "student"
    CONTRIBUTOR = "contributor"
    ADMIN = "admin"

class ResourceType(enum.Enum):
    VIDEO = "video"
    ARTICLE = "article"
    COURSE = "course"
    BOOK = "book"
    TOOL = "tool"
    PROJECT = "project"
    COMMUNITY = "community"

class ResourceCategory(enum.Enum):
    FOUNDATION = "foundation"
    CORE_STACK = "core_stack"
    ADVANCED = "advanced"
    PROJECTS = "projects"
    INDUSTRY_EXPOSURE = "industry_exposure"

class DifficultyLevel(enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

# Models
class User(Base):
    __tablename__ = 'users'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)  # Nullable for OAuth users
    name = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    role = Column(SQLEnum(UserRole), default=UserRole.STUDENT, index=True)
    auth_provider = Column(String(50), default="email")  # email, google
    
    # Profile stats
    skill_index = Column(Float, default=0.0)
    reputation_score = Column(Integer, default=0)
    contribution_count = Column(Integer, default=0)
    execution_score = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=utc_now, index=True)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)
    last_login = Column(DateTime, nullable=True)
    
    # Relationships
    progress = relationship('UserProgress', back_populates='user', cascade='all, delete-orphan')
    contributions = relationship('Contribution', back_populates='user', cascade='all, delete-orphan')
    personal_plan = relationship('PersonalPlanItem', back_populates='user', cascade='all, delete-orphan')

class Domain(Base):
    __tablename__ = 'domains'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(100), nullable=True)
    image_url = Column(String(500), nullable=True)
    
    # Market indicators
    market_demand = Column(Integer, default=0)  # 0-100 percentage
    difficulty_index = Column(Integer, default=0)  # 0-100
    time_to_competency = Column(String(50), nullable=True)  # e.g., "6-12 months"
    avg_salary_min = Column(Integer, nullable=True)
    avg_salary_max = Column(Integer, nullable=True)
    salary_currency = Column(String(10), default="USD")
    
    # Content
    overview = Column(Text, nullable=True)
    why_it_matters = Column(Text, nullable=True)
    core_concepts = Column(JSON, nullable=True)  # Array of strings
    required_skills = Column(JSON, nullable=True)  # Array of skill objects
    tool_stack = Column(JSON, nullable=True)  # Array of tool objects
    industry_applications = Column(JSON, nullable=True)  # Array of strings
    execution_strategy = Column(JSON, nullable=True)  # Array of step objects
    
    is_active = Column(Boolean, default=True, index=True)
    display_order = Column(Integer, default=0, index=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)
    
    # Relationships
    sections = relationship('DomainSection', back_populates='domain', cascade='all, delete-orphan')
    resources = relationship('Resource', back_populates='domain', cascade='all, delete-orphan')

class DomainSection(Base):
    __tablename__ = 'domain_sections'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    domain_id = Column(String(36), ForeignKey('domains.id', ondelete='CASCADE'), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=True)
    section_type = Column(String(50), nullable=False)  # overview, market_signal, skill_matrix, etc.
    display_order = Column(Integer, default=0)
    metadata = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)
    
    # Relationships
    domain = relationship('Domain', back_populates='sections')

class Resource(Base):
    __tablename__ = 'resources'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    domain_id = Column(String(36), ForeignKey('domains.id', ondelete='CASCADE'), nullable=False, index=True)
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    url = Column(String(500), nullable=False)
    resource_type = Column(SQLEnum(ResourceType), nullable=False, index=True)
    category = Column(SQLEnum(ResourceCategory), nullable=False, index=True)
    difficulty = Column(SQLEnum(DifficultyLevel), default=DifficultyLevel.BEGINNER, index=True)
    
    # Metadata
    provider = Column(String(100), nullable=True)  # YouTube, Coursera, etc.
    duration = Column(String(50), nullable=True)  # "2 hours", "4 weeks"
    is_free = Column(Boolean, default=True)
    thumbnail_url = Column(String(500), nullable=True)
    
    # Stats
    upvotes = Column(Integer, default=0)
    view_count = Column(Integer, default=0)
    
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)
    
    # Relationships
    domain = relationship('Domain', back_populates='resources')

class UserProgress(Base):
    __tablename__ = 'user_progress'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    domain_id = Column(String(36), ForeignKey('domains.id', ondelete='CASCADE'), nullable=False, index=True)
    
    completion_percentage = Column(Float, default=0.0)
    resources_completed = Column(JSON, default=list)  # Array of resource IDs
    current_section = Column(String(100), nullable=True)
    
    started_at = Column(DateTime, default=utc_now)
    last_activity = Column(DateTime, default=utc_now)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship('User', back_populates='progress')

class Contribution(Base):
    __tablename__ = 'contributions'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    
    contribution_type = Column(String(50), nullable=False)  # resource_add, feedback, etc.
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    reference_id = Column(String(36), nullable=True)  # Reference to resource/domain
    reference_type = Column(String(50), nullable=True)
    
    points_earned = Column(Integer, default=0)
    status = Column(String(50), default="pending")  # pending, approved, rejected
    
    created_at = Column(DateTime, default=utc_now)
    reviewed_at = Column(DateTime, nullable=True)
    reviewed_by = Column(String(36), nullable=True)
    
    # Relationships
    user = relationship('User', back_populates='contributions')

class PersonalPlanItem(Base):
    __tablename__ = 'personal_plan_items'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    resource_id = Column(String(36), ForeignKey('resources.id', ondelete='CASCADE'), nullable=False, index=True)
    
    is_completed = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    priority = Column(Integer, default=0)
    
    added_at = Column(DateTime, default=utc_now)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship('User', back_populates='personal_plan')

class Reputation(Base):
    __tablename__ = 'reputation_logs'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    
    action = Column(String(100), nullable=False)
    points = Column(Integer, default=0)
    description = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, default=utc_now)
