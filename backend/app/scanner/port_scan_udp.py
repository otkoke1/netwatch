import nmap
import socket
from typing import Dict, List, Union


def scan_ports(target: str, port_range: str = '9000-9999') -> Dict[str, Union[str, List[int]]]:
    scanner = nmap.PortScanner()
    open_ports = []

    try:
        # Resolve domain to IP
        target_ip = socket.gethostbyname(target)

        # Perform UDP scan
        scanner.scan(hosts=target_ip, arguments=f'-p {port_range} -sU')

        if target_ip in scanner.all_hosts() and 'udp' in scanner[target_ip]:
            for port in scanner[target_ip]['udp']:
                state = scanner[target_ip]['udp'][port]['state']

                if state in ['open', 'open|filtered']:
                    open_ports.append(port)

        return {
            "Target": target,
            "Resolved IP": target_ip,
            "Open Ports": open_ports
        }

    except socket.gaierror:
        raise Exception("Invalid domain or IP address")
    except Exception as e:
        raise Exception(f"Scan failed: {str(e)}")