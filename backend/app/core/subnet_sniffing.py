import platform
import socket
import ipaddress
import subprocess

import netifaces
from netifaces import AF_INET
from netmiko.cli_tools.outputters import output_raw
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
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception as e:
        print(f"Error getting local IP: {e}")
        return None

def get_gateway_ip():
    try:
        gws = netifaces.gateways()
        return gws['default'][netifaces.AF_INET][0]
    except Exception as e:
        print(f"Error getting gateway IP: {e}")
        return None

def get_gateway_mac(ip):
    pkt = Ether(dst="ff:ff:ff:ff:ff:ff") / ARP(pdst=ip)
    ans, _ = srp(pkt, timeout=2, verbose=False)
    for _, rcv in ans:
        return rcv.hwsrc
    return None

def get_dns():
    system = platform.system()
    if system == "Windows":
        try:
            output = subprocess.check_output("nslookup", shell=True, text=True)
            lines = output.splitlines()
            for i, line in enumerate(lines):
                if "Default Server" in line or "DNS request time out" in line:
                    continue
                if "Address" in line:
                    dns_ip = line.split(":")[-1].strip()
                    return dns_ip
        except Exception as e:
            print("Error getting DNS:", e)
            return None

if __name__ == "__main__":
    subnet = get_local_subnet()
    local_ip = get_local_ip()
    gateway_ip = get_gateway_ip()
    gateway_mac = get_gateway_mac(gateway_ip) if gateway_ip else None

    print("Detected Subnet:", subnet)
    print("Local Address: ", local_ip)
    print("Default Gateway IP:", gateway_ip)
    print("Default Gateway MAC:", gateway_mac)
    print("DNS Server:", get_dns())


