import os
import platform
import subprocess

# backend/app/core/force_port_close.py
def kill_udp_process():
    """Function to specifically close UDP port 9999"""
    port = 9999  # Hardcoded port number
    system = platform.system()

    if system == "Windows":
        try:
            cmd = 'netstat -ano | findstr /R /C:"UDP.*:9999"'
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)

            if not result.stdout.strip():
                return {"success": False, "message": "No process found using UDP port 9999"}

            pids = set()
            for line in result.stdout.strip().splitlines():
                parts = line.split()
                if parts and parts[-1].isdigit():
                    pids.add(int(parts[-1]))

            for pid in pids:
                subprocess.run(f'taskkill /F /PID {pid}', shell=True, check=True)

            return {"success": True, "message": "Successfully closed UDP port 9999"}

        except subprocess.CalledProcessError as e:
            return {"success": False, "message": f"Failed to kill process: {str(e)}"}
        except Exception as e:
            return {"success": False, "message": f"Error: {str(e)}"}

    return {"success": False, "message": "Operation only supported on Windows"}

if __name__ == "__main__":
    try:
        kill_udp_process()
    except Exception as e:
        print(f"[✘] Error: {e}")
