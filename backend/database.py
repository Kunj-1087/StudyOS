"""
Database configuration for studyOS.
Uses supabase-py SDK over HTTPS (port 443) — works on any network.
"""
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path
import os
import logging

logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv(Path(__file__).parent / '.env')

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_KEY')
SUPABASE_ANON_KEY = os.environ.get('SUPABASE_ANON_KEY')

# Use service key for backend (bypasses Row Level Security)
_KEY = SUPABASE_SERVICE_KEY or SUPABASE_ANON_KEY

supabase: Client = None

if SUPABASE_URL and _KEY:
    try:
        supabase = create_client(SUPABASE_URL, _KEY)
        logger.info("Supabase client initialised successfully")
    except Exception as e:
        logger.error(f"Failed to initialise Supabase client: {e}")
else:
    logger.warning("SUPABASE_URL or key not set — running in demo (in-memory) mode")


def get_supabase() -> Client:
    """Return the Supabase client. Raises if not configured."""
    if supabase is None:
        raise RuntimeError("Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env")
    return supabase


def is_database_configured() -> bool:
    """Check if Supabase is properly configured."""
    return supabase is not None
