import platform

import netifaces
from tabulate import tabulate
from tabnanny import verbose
import subprocess
import ctypes
from scapy.all import *
from scapy.layers.l2 import Ether, ARP
from backend.app.core.subnet_sniffing import get_local_subnet, find_active_interface

def is_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except Exception:
        return False

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

def live_host_discovery(verbose=False, timeout=0.3, retry=1, resolve_hostname=False, check_availability=False):
    import os
    iface_name = find_active_interface()
    subnet = str(get_local_subnet())
    print(f"[*] Scanning subnet: {subnet} on interface: {iface_name}")

    # Optional: Clear ARP cache (Windows/Linux only, may require admin)
    if platform.system().lower() == "windows":
        if is_admin():
            os.system("arp -d *")
        else:
            print("[!] Skipping ARP cache clear: requires admin privileges.")
    elif platform.system().lower() == "linux":
        os.system("ip -s -s neigh flush all")

    hosts = {}
    for _ in range(retry):
        packet = Ether(dst="ff:ff:ff:ff:ff:ff") / ARP(pdst=subnet)
        ans, _ = srp(packet, timeout=timeout, verbose=False, iface=iface_name)
        now = time.strftime('%Y-%m-%d %H:%M:%S')
        for _, rcv in ans:
            ip = rcv.psrc
            mac = rcv.hwsrc
            if ip not in hosts:  # Avoid duplicates
                hostname = get_hostname(ip)
                availability = host_availability_check(ip)
                hosts[ip] = {
                    "IP Address": ip,
                    "Mac Address": mac,
                    "Hostname": hostname,
                    "Last Heard": now,
                    "Availability": availability,
                    "Response Time": None
                }
    host_list = list(hosts.values())
    if verbose:
        if not host_list:
            print("[!] No response received")
        else:
            print(tabulate(host_list, headers="keys", tablefmt="fancy-grid"))
            print(f"Total Hosts Discovered: {len(host_list)}")
    return host_list



if __name__ == "__main__":
    live_host_discovery()
