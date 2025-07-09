import socket
import ipaddress
import netifaces
import pythoncom
import wmi
from netifaces import AF_INET
from scapy.layers.l2 import Ether, ARP, srp


def get_local_subnet():
    local_ip = get_local_ip()
    if not local_ip:
        raise RuntimeError("Could not determine local IP for subnet calculation")

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
        local_ip = get_local_ip()
        for iface in netifaces.interfaces():
            addrs = netifaces.ifaddresses(iface).get(AF_INET, [])
            for addr in addrs:
                if addr.get("addr") == local_ip:
                    gws = netifaces.gateways()
                    default_gw = gws.get('default', {}).get(AF_INET)
                    if default_gw and default_gw[1] == iface:
                        return default_gw[0]
                    for gw in gws.get(AF_INET, []):
                        if gw[1] == iface:
                            return gw[0]
        return None
    except Exception as e:
        print(f"Error getting gateway IP: {e}")
        return None


def get_gateway_mac(ip, iface_name):
    if not ip or not iface_name:
        return "Missing IP or Interface"
    pkt = Ether(dst="ff:ff:ff:ff:ff:ff") / ARP(pdst=ip)
    ans, _ = srp(pkt, timeout=2, verbose=False, iface=iface_name)
    for _, rcv in ans:
        return rcv.hwsrc
    return "Unable to detect MAC address"


def find_active_interface():
    try:
        pythoncom.CoInitialize()
        c = wmi.WMI()
        for adapter in c.Win32_NetworkAdapter():
            if adapter.NetEnabled:
                return adapter.NetConnectionID
        return None
    except Exception as e:
        print(f"Error finding active interface: {e}")
        return None


def get_personal_device_specs():
    try:
        c = wmi.WMI()
        for sys in c.Win32_ComputerSystemProduct():
            return f"{sys.Vendor} {sys.Name}"
    except Exception as e:
        print(f"Error getting device specs: {e}")
        return "Unknown Device"

if __name__ == "__main__":
    subnet = get_local_subnet()
    local_ip = get_local_ip()
    iface_name = find_active_interface()
    gateway_ip = get_gateway_ip()
    gateway_mac = get_gateway_mac(gateway_ip, iface_name) if gateway_ip and iface_name else None
    device_specs = get_personal_device_specs()

    print("Detected Subnet:", subnet)
    print("Local Address: ", local_ip)
    print("Default Gateway IP:", gateway_ip)
    print("Default Gateway MAC:", gateway_mac)
    print("Current using Network Interface:", iface_name)
    print("Device Specs:", device_specs)
