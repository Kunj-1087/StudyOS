#!/usr/bin/env python3
"""
studyOS Backend API Test Suite
Comprehensive testing of all API endpoints
"""
import requests
import sys
import json
from datetime import datetime

class StudyOSAPITester:
    def __init__(self, base_url="https://skill-matrix-14.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_result(self, test_name, success, details="", error=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "error": error,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} | {test_name}")
        if details:
            print(f"      Details: {details}")
        if error:
            print(f"      Error: {error}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        
        if headers is None:
            headers = {'Content-Type': 'application/json'}
        
        if self.token and 'Authorization' not in headers:
            headers['Authorization'] = f'Bearer {self.token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                try:
                    response_data = response.json()
                    details = f"Status: {response.status_code}"
                    self.log_result(name, True, details)
                    return True, response_data
                except json.JSONDecodeError:
                    details = f"Status: {response.status_code}, No JSON response"
                    self.log_result(name, True, details)
                    return True, {}
            else:
                error = f"Expected {expected_status}, got {response.status_code}"
                if response.text:
                    try:
                        error_data = response.json()
                        error += f" - {error_data.get('detail', response.text[:100])}"
                    except:
                        error += f" - {response.text[:100]}"
                self.log_result(name, False, error=error)
                return False, {}

        except Exception as e:
            self.log_result(name, False, error=str(e))
            return False, {}

    def test_health_endpoints(self):
        """Test basic health endpoints"""
        print("\n🔍 Testing Health Endpoints...")
        
        self.run_test("API Root", "GET", "", 200)
        self.run_test("Health Check", "GET", "health", 200)

    def test_auth_flow(self):
        """Test complete authentication flow"""
        print("\n🔍 Testing Authentication Flow...")
        
        # Generate unique test credentials
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        test_email = f"test_user_{timestamp}@studyos.test"
        test_password = "TestPass123!"
        test_name = f"Test User {timestamp}"

        # Test registration
        reg_data = {
            "email": test_email,
            "password": test_password,
            "name": test_name
        }
        
        success, response = self.run_test("User Registration", "POST", "auth/register", 200, reg_data)
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.log_result("Token received from registration", True, f"Token length: {len(self.token)}")
        else:
            self.log_result("Token received from registration", False, error="No token in registration response")

        # Test login with same credentials
        login_data = {
            "email": test_email,
            "password": test_password
        }
        
        success, response = self.run_test("User Login", "POST", "auth/login", 200, login_data)
        if success and 'access_token' in response:
            self.token = response['access_token']  # Update token
            self.log_result("Token received from login", True, f"Token length: {len(self.token)}")

        # Test getting user profile
        if self.token:
            success, response = self.run_test("Get User Profile", "GET", "auth/me", 200)
            if success and 'id' in response:
                self.user_id = response['id']
                self.log_result("User ID received", True, f"User ID: {self.user_id[:8]}...")

        # Test invalid login
        invalid_data = {
            "email": test_email,
            "password": "wrong_password"
        }
        self.run_test("Invalid Login", "POST", "auth/login", 401, invalid_data)

        # Test duplicate registration
        self.run_test("Duplicate Registration", "POST", "auth/register", 400, reg_data)

    def test_domains_api(self):
        """Test domain-related endpoints"""
        print("\n🔍 Testing Domain Endpoints...")
        
        # Test get all domains
        success, domains_data = self.run_test("Get All Domains", "GET", "domains", 200)
        
        if success and isinstance(domains_data, list):
            domain_count = len(domains_data)
            if domain_count == 8:
                self.log_result("Domain count validation", True, f"Found {domain_count} domains")
            else:
                self.log_result("Domain count validation", False, error=f"Expected 8 domains, got {domain_count}")
            
            # Verify domain structure
            if domain_count > 0:
                sample_domain = domains_data[0]
                required_fields = ['id', 'slug', 'name', 'market_demand', 'difficulty_index']
                missing_fields = [field for field in required_fields if field not in sample_domain]
                
                if not missing_fields:
                    self.log_result("Domain structure validation", True, f"All required fields present")
                else:
                    self.log_result("Domain structure validation", False, error=f"Missing fields: {missing_fields}")

                # Test specific domain lookup
                test_slug = sample_domain['slug']
                self.run_test(f"Get Domain by slug ({test_slug})", "GET", f"domains/{test_slug}", 200)
                
                # Test domain resources
                self.run_test(f"Get Domain Resources ({test_slug})", "GET", f"domains/{test_slug}/resources", 200)
                
                # Test category filtering
                self.run_test(f"Filter Resources (foundation)", "GET", f"domains/{test_slug}/resources?category=foundation", 200)

        # Test invalid domain
        self.run_test("Invalid Domain", "GET", "domains/invalid-domain", 404)

    def test_user_progress(self):
        """Test user progress tracking"""
        if not self.token:
            print("\n⚠️  Skipping progress tests - no authentication token")
            return

        print("\n🔍 Testing User Progress...")
        
        # Test get progress (should be empty initially)
        self.run_test("Get User Progress", "GET", "progress", 200)
        
        # Start a domain
        test_domain = "fintech"  # Using a known domain
        success, _ = self.run_test("Start Domain", "POST", f"progress/{test_domain}/start", 200)
        
        if success:
            # Get resources for the domain to test completion
            success, resources = self.run_test("Get Domain Resources for Progress", "GET", f"domains/{test_domain}/resources", 200)
            
            if success and isinstance(resources, list) and len(resources) > 0:
                resource_id = resources[0]['id']
                self.run_test("Complete Resource", "POST", f"progress/{test_domain}/complete-resource/{resource_id}", 200)
            else:
                self.log_result("Resource completion test", False, error="No resources found for progress test")

    def test_personal_plan(self):
        """Test personal plan functionality"""
        if not self.token:
            print("\n⚠️  Skipping personal plan tests - no authentication token")
            return

        print("\n🔍 Testing Personal Plan...")
        
        # Test get personal plan (should be empty initially)
        self.run_test("Get Personal Plan", "GET", "personal-plan", 200)
        
        # Get a resource to add to plan
        success, domains = self.run_test("Get Domains for Plan Test", "GET", "domains", 200)
        if success and isinstance(domains, list) and len(domains) > 0:
            test_domain = domains[0]['slug']
            
            success, resources = self.run_test("Get Resources for Plan Test", "GET", f"domains/{test_domain}/resources", 200)
            if success and isinstance(resources, list) and len(resources) > 0:
                resource_id = resources[0]['id']
                
                # Add to plan
                plan_data = {"resource_id": resource_id}
                success, _ = self.run_test("Add to Personal Plan", "POST", "personal-plan/add", 200, plan_data)
                
                if success:
                    # Test duplicate add
                    self.run_test("Add Duplicate to Plan", "POST", "personal-plan/add", 400, plan_data)
                    
                    # Complete plan item
                    self.run_test("Complete Plan Item", "PUT", f"personal-plan/{resource_id}/complete", 200)
                    
                    # Remove from plan
                    self.run_test("Remove from Plan", "DELETE", f"personal-plan/{resource_id}", 200)

    def test_user_stats(self):
        """Test user statistics endpoint"""
        if not self.token:
            print("\n⚠️  Skipping user stats test - no authentication token")
            return

        print("\n🔍 Testing User Statistics...")
        
        success, stats_data = self.run_test("Get User Stats", "GET", "user/stats", 200)
        
        if success:
            required_stats = ['skill_index', 'reputation_score', 'domains_started', 'activity']
            missing_stats = [stat for stat in required_stats if stat not in stats_data]
            
            if not missing_stats:
                self.log_result("User stats structure", True, "All required stats present")
            else:
                self.log_result("User stats structure", False, error=f"Missing stats: {missing_stats}")

    def test_resources_api(self):
        """Test resource-related endpoints"""
        print("\n🔍 Testing Resource Endpoints...")
        
        # Get a resource to test individual resource endpoint
        success, domains = self.run_test("Get Domains for Resource Test", "GET", "domains", 200)
        if success and isinstance(domains, list) and len(domains) > 0:
            test_domain = domains[0]['slug']
            
            success, resources = self.run_test("Get Resources for Individual Test", "GET", f"domains/{test_domain}/resources", 200)
            if success and isinstance(resources, list) and len(resources) > 0:
                resource_id = resources[0]['id']
                
                # Test individual resource endpoint
                self.run_test("Get Individual Resource", "GET", f"resources/{resource_id}", 200)
                
                # Test upvote (requires auth)
                if self.token:
                    self.run_test("Upvote Resource", "POST", f"resources/{resource_id}/upvote", 200)

        # Test invalid resource
        self.run_test("Invalid Resource", "GET", "resources/invalid-id", 404)

    def generate_report(self):
        """Generate and save test report"""
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        report = {
            "test_summary": {
                "total_tests": self.tests_run,
                "passed_tests": self.tests_passed,
                "failed_tests": self.tests_run - self.tests_passed,
                "success_rate": f"{success_rate:.1f}%"
            },
            "test_results": self.test_results,
            "timestamp": datetime.now().isoformat()
        }
        
        # Save detailed report
        with open('/app/test_reports/backend_detailed_results.json', 'w') as f:
            json.dump(report, f, indent=2)
        
        return report

    def run_all_tests(self):
        """Run complete test suite"""
        print("🚀 Starting studyOS Backend API Test Suite")
        print(f"🎯 Target URL: {self.base_url}")
        print("=" * 60)
        
        # Run all test categories
        self.test_health_endpoints()
        self.test_auth_flow()
        self.test_domains_api()
        self.test_resources_api()
        self.test_user_progress()
        self.test_personal_plan()
        self.test_user_stats()
        
        # Generate report
        report = self.generate_report()
        
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {report['test_summary']['total_tests']}")
        print(f"Passed: {report['test_summary']['passed_tests']}")
        print(f"Failed: {report['test_summary']['failed_tests']}")
        print(f"Success Rate: {report['test_summary']['success_rate']}")
        
        # Show failed tests
        failed_tests = [r for r in self.test_results if not r['success']]
        if failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"  • {test['test']}: {test['error']}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = StudyOSAPITester()
    
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! Backend API is fully functional.")
        return 0
    else:
        print("\n⚠️  Some tests failed. Please review the results above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())