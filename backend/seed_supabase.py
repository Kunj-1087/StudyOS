"""
Seed script — pushes all domain + resource data to Supabase over HTTPS.
Run once: python seed_supabase.py
"""
import os, uuid
from datetime import datetime, timezone
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent / '.env')
from supabase import create_client
from seed_data import DOMAINS_DATA, RESOURCES_DATA

sb = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_SERVICE_KEY'])

def now_iso():
    return datetime.now(timezone.utc).isoformat()

print("🌱  Seeding studyOS data to Supabase...\n")

# ── Clear existing data ──────────────────────────────────────────────────────
print("  Clearing existing domain/resource data...")
sb.table("resources").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
sb.table("domains").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
print("  Cleared.\n")

# ── Seed domains ─────────────────────────────────────────────────────────────
domain_id_map = {}   # slug → id

for idx, domain_data in enumerate(DOMAINS_DATA):
    domain_id = str(uuid.uuid4())
    domain_id_map[domain_data["slug"]] = domain_id

    row = {
        "id": domain_id,
        **domain_data,
        "is_active": True,
        "display_order": idx,
        "created_at": now_iso(),
        "updated_at": now_iso(),
    }

    sb.table("domains").insert(row).execute()
    print(f"  ✅  Domain: {domain_data['name']}")

print(f"\n  {len(DOMAINS_DATA)} domains seeded.\n")

# ── Seed resources ────────────────────────────────────────────────────────────
total_resources = 0
for slug, resources in RESOURCES_DATA.items():
    domain_id = domain_id_map.get(slug)
    if not domain_id:
        print(f"  ⚠️  No domain found for slug: {slug}, skipping...")
        continue

    rows = []
    for idx, res in enumerate(resources):
        rows.append({
            "id": str(uuid.uuid4()),
            "domain_id": domain_id,
            **res,
            "upvotes": 0,
            "view_count": 0,
            "is_verified": True,
            "is_active": True,
            "display_order": idx,
            "created_at": now_iso(),
            "updated_at": now_iso(),
        })

    # Insert in batches of 20
    batch_size = 20
    for i in range(0, len(rows), batch_size):
        sb.table("resources").insert(rows[i:i+batch_size]).execute()

    total_resources += len(rows)
    print(f"  ✅  Resources for '{slug}': {len(rows)}")

print(f"\n  {total_resources} resources seeded.\n")

# ── Verify ────────────────────────────────────────────────────────────────────
d_count = sb.table("domains").select("*", count="exact").limit(0).execute().count
r_count = sb.table("resources").select("*", count="exact").limit(0).execute().count

print("=" * 45)
print(f"  🎉  Seed complete!")
print(f"  Domains:   {d_count}")
print(f"  Resources: {r_count}")
print("=" * 45)
