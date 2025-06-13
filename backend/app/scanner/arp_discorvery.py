import platform

import netifaces
from tabulate import tabulate
from tabnanny import verbose
import subprocess
from scapy.all import *
from scapy.layers.l2 import Ether, ARP
from backend.app.core.subnet_sniffing import get_local_subnet, find_active_interface


def get_hostname(ip):
    try:
        return socket.gethostbyaddr(ip)[0]
    except Exception:
        return "Unknown Hostname"

def host_availability_check(ip):
    param = '-n' if platform.system().lower() == 'windows' else '-c'
    try:
        result = subprocess.run(['ping', param, '1', ip], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return result.returncode == 0
    except Exception:
        return False

def live_host_discovery(verbose=False):
    iface_name = find_active_interface()
    subnet = str(get_local_subnet())
    print(f"[*] Scanning subnet: {subnet} on interface: {iface_name}")
    packet = Ether(dst="ff:ff:ff:ff:ff:ff") / ARP(pdst=subnet)
    ans, _ = srp(packet, timeout=2 , verbose=False, iface=iface_name)

    hosts = []
    now = time.strftime('%Y-%m-%d %H:%M:%S')
    for _, rcv in ans:
        ip = rcv.psrc
        mac = rcv.hwsrc
        hostname = get_hostname(ip)
        availability = host_availability_check(ip)

        hosts.append({
            "IP Address": ip,
            "Mac Address": mac,
            "Hostname" : hostname,
            "Last Heard": now,
            "Availability": availability,
            "Response Time": None
        })
    if verbose:
        if not hosts:
            print("[!] No response received")
        else:
            print(tabulate(hosts, headers="keys", tablefmt="fancy-grid"))
            print(f"Total Hosts Discovered: {len(hosts)}")

    return hosts



if __name__ == "__main__":
    live_host_discovery()
