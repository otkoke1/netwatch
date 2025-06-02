import socket
import ipaddress
import netifaces
from netifaces import AF_INET
from pygments.lexer import default
from scapy.layers.l2 import Ether, ARP, srp

def get_local_subnet():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
    finally:
        s.close()

    for iface in netifaces.interfaces():
        addrs = netifaces.ifaddresses(iface).get(AF_INET)
        if not addrs:
            continue
        for addr in addrs:
            if addr.get("addr") == local_ip:
                netmask = addr.get("netmask")
                if netmask:
                    return ipaddress.IPv4Network(f"{local_ip}/{netmask}", strict=False)
    raise RuntimeError("Unable to identify subnet of current IP address")

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    finally:
        s.close()
    return ip

def get_gateway_ip():
    gws = netifaces.gateways()
    default_gateway = gws.get('default', {}).get(netifaces.AF_INET)
    if default_gateway:
        return default_gateway[0]
    return None

def get_mac(ip):
    pkt = Ether(dst="ff:ff:ff:ff:ff:ff") / ARP(pdst=ip)
    ans, _ = srp(pkt, timeout=2, verbose=False, iface="Ethernet")
    for _, rcv in ans:
        return rcv.hwsrc
    return None


if __name__ == "__main__":
    subnet = get_local_subnet()
    local_ip = get_local_ip()
    gateway_ip = get_gateway_ip()
    gateway_mac = get_mac(gateway_ip) if gateway_ip else None

    print("Detected Subnet:", subnet)
    print("Local Address: ", local_ip)
    print("Default Gateway IP:", gateway_ip)
    print("Default Gateway MAC:", gateway_mac)

