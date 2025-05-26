from asyncio import timeout
from tabnanny import verbose
from scapy.all import *
from scapy.layers.l2 import Ether, ARP
from backend.app.core.subnet_sniffing import get_local_subnet


def live_host_discovery():
    subnet = str(get_local_subnet())
    print(f"[*] Scanning subnet: {subnet}")

    packet = Ether(dst="ff:ff:ff:ff:ff:ff") / ARP(pdst=subnet)
    ans, _ = srp(packet, timeout=2 , verbose=False)

    hosts = []
    for _, rcv in ans:
        hosts.append({
            "ip": rcv.psrc,
            "mac": rcv.hwsrc
        })

    if not ans:
        print("[!] No response received.")
    else:
        for _, rcv in ans:
            print(f"[+] Host {rcv.psrc} is up, MAC: {rcv.hwsrc}")



if __name__ == "__main__":
    print(live_host_discovery())
