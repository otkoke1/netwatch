import subprocess
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def kill_udp_process(port, address=None):
    logger.debug(f"Attempting to close port {port} for address {address}")

    if not isinstance(port, int):
        try:
            port = int(port)
        except (TypeError, ValueError):
            return {"success": False, "message": "Invalid port number"}

    if not (9000 <= port <= 9999):
        return {"success": False, "message": f"Port {port} is outside allowed range (9000-9999)"}

    try:
        cmd = f'netstat -ano | findstr ":{port}"'
        result = subprocess.check_output(cmd, shell=True, text=True)

        for line in result.strip().split('\n'):
            if f":{port}" in line and "UDP" in line:
                try:
                    pid = line.strip().split()[-1]
                    logger.debug(f"Found process with PID: {pid}")

                    kill_cmd = f"taskkill /F /PID {pid}"
                    logger.debug(f"Executing: {kill_cmd}")
                    subprocess.call(kill_cmd, shell=True)

                    try:
                        verify = subprocess.check_output(f'netstat -ano | findstr ":{port}"', shell=True)
                        return {"success": False, "message": "Port is still in use"}
                    except subprocess.CalledProcessError:
                        return {"success": True, "message": f"Successfully closed UDP port {port}"}

                except Exception as e:
                    logger.error(f"Error during process termination: {str(e)}")
                    return {"success": False, "message": f"Failed to terminate process: {str(e)}"}

        return {"success": False, "message": f"No process found using port {port}"}

    except subprocess.CalledProcessError:
        return {"success": False, "message": "No process found"}
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return {"success": False, "message": f"Error: {str(e)}"}