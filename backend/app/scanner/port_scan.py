import nmap

def scan_ports(target_ip, port_range='1-1024'):
    scanner = nmap.PortScanner()
    open_ports = []
    scanner.scan(hosts=target_ip, arguments=f'-p {port_range} ')
    if target_ip not in scanner.all_hosts():
        return open_ports
    for port in scanner[target_ip]['tcp']:
        state = scanner[target_ip]['tcp'][port]['state']
        if state == 'open':
            open_ports.append(port)
    return open_ports


