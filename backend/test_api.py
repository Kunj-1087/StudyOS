"""
Full API test suite for studyOS backend.
Tests every endpoint against the live server.
"""
import requests
import json
import sys

BASE = "http://localhost:8001/api"
PASS = "✅"
FAIL = "❌"
results = []

def test(name, fn):
    try:
        result = fn()
        print(f"  {PASS}  {name}")
        results.append((name, True, None))
        return result
    except AssertionError as e:
        print(f"  {FAIL}  {name} — {e}")
        results.append((name, False, str(e)))
        return None
    except Exception as e:
        print(f"  {FAIL}  {name} — {type(e).__name__}: {e}")
        results.append((name, False, str(e)))
        return None

TOKEN = None
USER_ID = None
DOMAIN_SLUG = None
RESOURCE_ID = None

print("=" * 50)
print("  studyOS API Test Suite")
print("=" * 50)

# ── 1. Health ─────────────────────────────────────────────────────────────────
print("\n[ 1 ] Health & Root")

def t_root():
    r = requests.get(f"{BASE}/", timeout=10)
    assert r.status_code == 200, f"status={r.status_code}"
    assert "studyOS" in r.json().get("message", ""), f"body={r.json()}"
test("GET /api/  — root", t_root)

def t_health():
    r = requests.get(f"{BASE}/health", timeout=10)
    assert r.status_code == 200, f"status={r.status_code}"
    data = r.json()
    assert data["status"] == "healthy", data
    print(f"         DB mode: {data['database']}")
test("GET /api/health", t_health)

# ── 2. Auth ───────────────────────────────────────────────────────────────────
print("\n[ 2 ] Authentication")

import time, random
EMAIL = f"testuser_{int(time.time())}@gmail.com"
PASSWORD = "Test@12345"

def t_register():
    global TOKEN, USER_ID
    r = requests.post(f"{BASE}/auth/register", json={"email": EMAIL, "password": PASSWORD, "name": "Test User"}, timeout=15)
    assert r.status_code == 200, f"status={r.status_code} body={r.text[:200]}"
    data = r.json()
    assert "access_token" in data, data
    TOKEN = data["access_token"]
    print(f"         Token: {TOKEN[:30]}...")
reg = test("POST /api/auth/register", t_register)

def t_register_dupe():
    r = requests.post(f"{BASE}/auth/register", json={"email": EMAIL, "password": PASSWORD, "name": "Dupe"}, timeout=15)
    assert r.status_code == 400, f"Expected 400, got {r.status_code}"
test("POST /api/auth/register (duplicate → 400)", t_register_dupe)

def t_login():
    r = requests.post(f"{BASE}/auth/login", json={"email": EMAIL, "password": PASSWORD}, timeout=15)
    assert r.status_code == 200, f"status={r.status_code} body={r.text[:200]}"
    assert "access_token" in r.json(), r.json()
test("POST /api/auth/login", t_login)

def t_login_bad():
    r = requests.post(f"{BASE}/auth/login", json={"email": EMAIL, "password": "wrongpass"}, timeout=15)
    assert r.status_code == 401, f"Expected 401, got {r.status_code}"
test("POST /api/auth/login (wrong password → 401)", t_login_bad)

def t_me():
    global USER_ID
    r = requests.get(f"{BASE}/auth/me", headers={"Authorization": f"Bearer {TOKEN}"}, timeout=15)
    assert r.status_code == 200, f"status={r.status_code} body={r.text[:200]}"
    data = r.json()
    assert data["email"] == EMAIL, data
    USER_ID = data["id"]
    print(f"         User ID: {USER_ID}")
test("GET /api/auth/me", t_me)

def t_me_unauth():
    r = requests.get(f"{BASE}/auth/me", timeout=10)
    assert r.status_code == 401, f"Expected 401, got {r.status_code}"
test("GET /api/auth/me (no token → 401)", t_me_unauth)

# ── 3. Domains ────────────────────────────────────────────────────────────────
print("\n[ 3 ] Domains")

def t_domains():
    global DOMAIN_SLUG
    r = requests.get(f"{BASE}/domains", timeout=15)
    assert r.status_code == 200, f"status={r.status_code}"
    data = r.json()
    assert len(data) > 0, "No domains returned"
    DOMAIN_SLUG = data[0]["slug"]
    print(f"         {len(data)} domains. First: '{data[0]['name']}' (slug={DOMAIN_SLUG})")
test("GET /api/domains", t_domains)

def t_domain_detail():
    r = requests.get(f"{BASE}/domains/{DOMAIN_SLUG}", timeout=15)
    assert r.status_code == 200, f"status={r.status_code}"
    data = r.json()
    assert data["slug"] == DOMAIN_SLUG, data
test(f"GET /api/domains/{{slug}}", t_domain_detail)

def t_domain_404():
    r = requests.get(f"{BASE}/domains/nonexistent-domain-xyz", timeout=15)
    assert r.status_code == 404, f"Expected 404, got {r.status_code}"
test("GET /api/domains/nonexistent (→ 404)", t_domain_404)

# ── 4. Resources ───────────────────────────────────────────────────────────────
print("\n[ 4 ] Resources")

def t_resources():
    global RESOURCE_ID
    r = requests.get(f"{BASE}/domains/{DOMAIN_SLUG}/resources", timeout=15)
    assert r.status_code == 200, f"status={r.status_code}"
    data = r.json()
    assert len(data) > 0, "No resources returned"
    RESOURCE_ID = data[0]["id"]
    print(f"         {len(data)} resources. First: '{data[0]['title']}'")
test(f"GET /api/domains/{{slug}}/resources", t_resources)

def t_resource_detail():
    r = requests.get(f"{BASE}/resources/{RESOURCE_ID}", timeout=15)
    assert r.status_code == 200, f"status={r.status_code}"
    data = r.json()
    assert data["id"] == RESOURCE_ID, data
test("GET /api/resources/{id}", t_resource_detail)

def t_upvote():
    r = requests.post(f"{BASE}/resources/{RESOURCE_ID}/upvote",
                      headers={"Authorization": f"Bearer {TOKEN}"}, timeout=15)
    assert r.status_code == 200, f"status={r.status_code} body={r.text[:200]}"
    assert r.json()["upvotes"] >= 1, r.json()
test("POST /api/resources/{id}/upvote", t_upvote)

# ── 5. Progress ───────────────────────────────────────────────────────────────
print("\n[ 5 ] User Progress")

def t_start_domain():
    r = requests.post(f"{BASE}/progress/{DOMAIN_SLUG}/start",
                      headers={"Authorization": f"Bearer {TOKEN}"}, timeout=15)
    assert r.status_code == 200, f"status={r.status_code} body={r.text[:200]}"
test("POST /api/progress/{slug}/start", t_start_domain)

def t_get_progress():
    r = requests.get(f"{BASE}/progress",
                     headers={"Authorization": f"Bearer {TOKEN}"}, timeout=15)
    assert r.status_code == 200, f"status={r.status_code}"
    data = r.json()
    print(f"         {len(data)} domain(s) in progress")
test("GET /api/progress", t_get_progress)

def t_complete_resource():
    r = requests.post(f"{BASE}/progress/{DOMAIN_SLUG}/complete-resource/{RESOURCE_ID}",
                      headers={"Authorization": f"Bearer {TOKEN}"}, timeout=15)
    assert r.status_code == 200, f"status={r.status_code} body={r.text[:200]}"
    data = r.json()
    assert RESOURCE_ID in data["progress"]["resources_completed"], data
test("POST /api/progress/{slug}/complete-resource/{id}", t_complete_resource)

# ── 6. Personal Plan ──────────────────────────────────────────────────────────
print("\n[ 6 ] Personal Plan")

def t_add_plan():
    r = requests.post(f"{BASE}/personal-plan/add",
                      json={"resource_id": RESOURCE_ID},
                      headers={"Authorization": f"Bearer {TOKEN}"}, timeout=15)
    assert r.status_code == 200, f"status={r.status_code} body={r.text[:200]}"
test("POST /api/personal-plan/add", t_add_plan)

def t_add_plan_dupe():
    r = requests.post(f"{BASE}/personal-plan/add",
                      json={"resource_id": RESOURCE_ID},
                      headers={"Authorization": f"Bearer {TOKEN}"}, timeout=15)
    assert r.status_code == 400, f"Expected 400, got {r.status_code}"
test("POST /api/personal-plan/add (duplicate → 400)", t_add_plan_dupe)

def t_get_plan():
    r = requests.get(f"{BASE}/personal-plan",
                     headers={"Authorization": f"Bearer {TOKEN}"}, timeout=15)
    assert r.status_code == 200, f"status={r.status_code}"
    data = r.json()
    assert len(data) > 0, "Plan is empty"
test("GET /api/personal-plan", t_get_plan)

def t_complete_plan():
    r = requests.put(f"{BASE}/personal-plan/{RESOURCE_ID}/complete",
                     headers={"Authorization": f"Bearer {TOKEN}"}, timeout=15)
    assert r.status_code == 200, f"status={r.status_code} body={r.text[:200]}"
test("PUT /api/personal-plan/{id}/complete", t_complete_plan)

def t_remove_plan():
    r = requests.delete(f"{BASE}/personal-plan/{RESOURCE_ID}",
                        headers={"Authorization": f"Bearer {TOKEN}"}, timeout=15)
    assert r.status_code == 200, f"status={r.status_code} body={r.text[:200]}"
test("DELETE /api/personal-plan/{id}", t_remove_plan)

# ── 7. User Stats ─────────────────────────────────────────────────────────────
print("\n[ 7 ] User Stats")

def t_stats():
    r = requests.get(f"{BASE}/user/stats",
                     headers={"Authorization": f"Bearer {TOKEN}"}, timeout=15)
    assert r.status_code == 200, f"status={r.status_code}"
    data = r.json()
    assert "skill_index" in data and "domain_progress" in data, data
    print(f"         Domains started: {data['domains_started']}")
test("GET /api/user/stats", t_stats)

# ── Summary ───────────────────────────────────────────────────────────────────
passed = sum(1 for _, ok, _ in results if ok)
failed = sum(1 for _, ok, _ in results if not ok)

print()
print("=" * 50)
print(f"  Results: {passed}/{len(results)} passed")
if failed:
    print(f"\n  Failed tests:")
    for name, ok, err in results:
        if not ok:
            print(f"    ❌  {name}")
            print(f"        {err}")
print("=" * 50)
sys.exit(0 if failed == 0 else 1)
