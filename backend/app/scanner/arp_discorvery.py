from asyncio import timeout
import time
from tabulate import tabulate
from tabnanny import verbose
import socket
from scapy.all import *
from scapy.layers.l2 import Ether, ARP
from backend.app.core.subnet_sniffing import get_local_subnet

def get_hostname(ip):
    try:
        return socket.gethostbyname(ip)[0]
    except socket.herror:
        return "Unknown"

def live_host_discovery():
    subnet = str(get_local_subnet())
    print(f"[*] Scanning subnet: {subnet}")

    packet = Ether(dst="ff:ff:ff:ff:ff:ff") / ARP(pdst=subnet)
    ans, _ = srp(packet, timeout=2 , verbose=False)

    hosts = []
    now = time.strftime('%Y-%m-%d %H:%M:%S')

    for _, rcv in ans:
        ip = rcv.psrc
        mac = rcv.hwsrc
        hostname = get_hostname(ip)

        hosts.append({
            "IP Address": ip,
            "Mac Address": mac,
            "Hostname" : hostname,
            "Last Heard": now,
            "Availability": True,
            "Response Time": 0
        })
    if not hosts:
        print("[!] No response received")
        return []

    print(tabulate(hosts, headers="keys", tablefmt="fancy-grid"))
    return hosts



if __name__ == "__main__":
    live_host_discovery()
