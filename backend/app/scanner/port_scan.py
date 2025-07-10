import nmap
import socket

def scan_ports(target, port_range='1-1024'):
    scanner = nmap.PortScanner()
    open_ports = []

    try:
        # Resolve domain to IP if necessary
        target_ip = socket.gethostbyname(target)
    except socket.gaierror:
        raise Exception("Invalid domain or IP address")

    try:
        scanner.scan(hosts=target_ip, arguments=f'-p {port_range}')
    except Exception as e:
        raise Exception(f"Scan failed: {str(e)}")

    if target_ip not in scanner.all_hosts():
        return []

    for port in scanner[target_ip]['tcp']:
        state = scanner[target_ip]['tcp'][port]['state']
        if state == 'open':
            open_ports.append(port)

    return {
        "Target": target,
        "Resolved IP": target_ip,
        "Open Ports": open_ports
    }
