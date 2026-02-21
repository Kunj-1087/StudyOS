import os
from supabase import create_client
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
load_dotenv(Path(__file__).parent / '.env')

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("Error: SUPABASE_URL or SUPABASE_SERVICE_KEY not found in .env")
    exit(1)

# Initialize Supabase client with service key
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

target_email = "kunjnakrani1087@gmail.com"

try:
    # 1. Find user by email
    # Note: Using auth.admin requires service_role key
    users = supabase.auth.admin.list_users()
    
    target_user = next((u for u in users if u.email == target_email), None)
    
    if not target_user:
        print(f"User {target_email} not found.")
        exit(1)
        
    print(f"Found user: {target_user.id}")
    
    # 2. Update user to be confirmed
    supabase.auth.admin.update_user_by_id(
        target_user.id,
        {
            "email_confirm": True,
            "user_metadata": { "email_verified": True }
        }
    )
    
    # Also update in our public.users table if needed
    supabase.table("users").update({"updated_at": "now()"}).eq("id", target_user.id).execute()
    
    print(f"Successfully confirmed user {target_email}!")
    
except Exception as e:
    print(f"An error occurred: {e}")
