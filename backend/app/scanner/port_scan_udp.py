import nmap
import socket
from typing import Dict, List, Union

def scan_ports(target: str, port_range: str = '9000-9999') -> Dict[str, Union[str, List[int]]]:
    scanner = nmap.PortScanner()
    open_ports = []

    try:
        target_ip = socket.gethostbyname(target)
    except socket.gaierror:
        raise Exception("Invalid domain or IP address")

    try:
        scanner.scan(hosts=target_ip, arguments=f'-p {port_range} -sU')
    except nmap.PortScannerError as e:
        raise Exception(f"Scan failed: Permission denied. Run with administrator privileges.")
    except Exception as e:
        raise Exception(f"Scan failed: {str(e)}")

    if target_ip not in scanner.all_hosts():
        return {
            "Target": target,
            "Resolved IP": target_ip,
            "Open Ports": open_ports
        }

    # Check if UDP scan results exist
    if 'udp' in scanner[target_ip]:
        for port in scanner[target_ip]['udp']:
            state = scanner[target_ip]['udp'][port]['state']
            # Include both 'open' and 'open|filtered' states
            if state in ['open', 'open|filtered']:
                open_ports.append(port)

    return {
        "Target": target,
        "Resolved IP": target_ip,
        "Open Ports": open_ports
    }

if __name__ == "__main__":
    target = "10.22.65.88"
    port_range = "9000-9999"
    result = scan_ports(target, port_range)
    print(result)