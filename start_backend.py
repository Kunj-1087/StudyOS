
import subprocess
import time
import sys
import os

def run_backend():
    cmd = [sys.executable, "-m", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001", "--reload"]
    print(f"🚀 Starting studyOS Backend with auto-restart...")
    
    while True:
        try:
            process = subprocess.Popen(cmd, cwd=os.path.join(os.getcwd(), "backend"))
            process.wait()
            if process.returncode != 0:
                print(f"⚠️ Backend exited with code {process.returncode}. Restarting in 3 seconds...")
            else:
                print(f"ℹ️ Backend stopped gracefully. Restarting...")
        except KeyboardInterrupt:
            print("🛑 Stopping backend...")
            break
        except Exception as e:
            print(f"❌ Error running backend: {e}. Retrying in 5 seconds...")
            time.sleep(5)
        
        time.sleep(3)

if __name__ == "__main__":
    run_backend()
