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

try:
    # List all users
    users_response = supabase.auth.admin.list_users()
    
    for user in users_response:
        if not user.email_confirmed_at:
            print(f"Confirming user: {user.email} (ID: {user.id})")
            supabase.auth.admin.update_user_by_id(
                user.id,
                {
                    "email_confirm": True
                }
            )
            print(f"Successfully confirmed {user.email}")
        else:
            print(f"User {user.email} already confirmed.")
            
except Exception as e:
    print(f"An error occurred: {e}")
