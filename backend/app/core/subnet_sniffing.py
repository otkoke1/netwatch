import socket
import ipaddress
import netifaces
import pythoncom
import wmi
from netifaces import AF_INET
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

def get_gateway_mac(ip, iface_name):
    pkt = Ether(dst="ff:ff:ff:ff:ff:ff") / ARP(pdst=ip)
    ans, _ = srp(pkt, timeout=2, verbose=False, iface=iface_name)
    for _, rcv in ans:
        return rcv.hwsrc
    return "Unable to detect MAC address"


def find_active_interface():
    pythoncom.CoInitialize()
    c = wmi.WMI()
    for adapter in c.Win32_NetworkAdapter():
        if adapter.NetEnabled:
            return adapter.NetConnectionID
    return None

def get_personal_device_specs():
    c = wmi.WMI()
    for board in c.Win32_BaseBoard():
        return f"{board.Manufacturer} {board.Product}"
    return "Unknown Device"




if __name__ == "__main__":
    subnet = get_local_subnet()
    local_ip = get_local_ip()
    gateway_ip = get_gateway_ip()
    iface_name = find_active_interface()
    gateway_mac = get_gateway_mac(gateway_ip, iface_name) if gateway_ip and iface_name else None
    device_specs = get_personal_device_specs()

    print("Detected Subnet:", subnet)
    print("Local Address: ", local_ip)
    print("Default Gateway IP:", gateway_ip)
    print("Default Gateway MAC:", gateway_mac)
    print("Current using Network Interface:", iface_name)
    print("Device Specs:", device_specs)




