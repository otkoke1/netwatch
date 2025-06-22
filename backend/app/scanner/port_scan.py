import nmap

def scan_ports(target_ip, port_range='1-1024'):
    scanner = nmap.PortScanner()
    try:
        print(f"Scanning {target_ip} on ports {port_range}...")
        scanner.scan(hosts=target_ip, arguments=f'-p {port_range}')

        if target_ip not in scanner.all_hosts():
            print("Host not found or unreachable.")
            return

        for port in scanner[target_ip]['tcp']:
            state = scanner[target_ip]['tcp'][port]['state']
            print(f'Port {port} is {state}')

    except Exception as e:
        print(f"Error scanning ports: {e}")

# Example usage
scan_ports('192.168.100.1')
