import platform
from netaddr.ip import IPNetwork
from tabulate import tabulate
from scapy.all import *
from scapy.layers.l2 import Ether, ARP
from concurrent.futures import ThreadPoolExecutor
from backend.app.core.subnet_sniffing import get_local_subnet, find_active_interface, get_local_ip
from mac_vendor_lookup import MacLookup
import requests

def is_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except Exception:
        return False

def ping_host(ip):
    param = '-n' if platform.system().lower() == 'windows' else '-c'
    try:
        result = subprocess.run(['ping', param, '1', ip],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=1)
        return ip, result.returncode == 0
    except:
        return ip, False

def find_fing_host():
    local_ip = get_local_ip()
    if not local_ip:
        return None

    ip_parts = local_ip.split('.')
    subnet_prefix = '.'.join(ip_parts[:-1])

    common_ips = ['.1', '.2', '.175', '.254', '.255']
    for suffix in common_ips:
        host = f"{subnet_prefix}{suffix}"
        try:
            test_url = f"http://{host}:49090/1/devices"
            response = requests.get(test_url, params={"auth": "fing_loc_api123"}, timeout=0.3)
            if response.status_code == 200:
                print(f"[*] Found Fing service at {host}")
                return host
        except:
            continue
    return None



def get_devices_names():
    fing_host = find_fing_host()
    if not fing_host:
        return []

    fing_api_url = f"http://{fing_host}:49090/1/devices"
    auth_params = {"auth": "fing_loc_api123"}

    try:
        response = requests.get(fing_api_url, params=auth_params, timeout=2)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, dict) and 'devices' in data:
                return data['devices']
            return []
        return []
    except:
        return []

def update_device_names(hosts):
    try:
        fing_devices = get_devices_names()
        if not fing_devices:
            return hosts

        device_names = {}
        for device in fing_devices:
            if isinstance(device, dict):
                ip_addresses = device.get('ip', [])
                name = device.get('name', 'Unknown')
                for ip in ip_addresses:
                    if ip:
                        device_names[ip] = name

        for host in hosts:
            host['name'] = device_names.get(host['ip'], 'Unknown')
        return hosts
    except:
        return hosts

def live_host_discovery(verbose=False, timeout=0.2, retry=2, resolve_hostname=False, check_availability=False):
    mac_lookup = MacLookup()
    iface_name = find_active_interface()
    subnet = str(get_local_subnet())
    print(f"[*] Scanning subnet: {subnet} on interface: {iface_name}")

    ips = [str(ip) for ip in IPNetwork(subnet)]
    chunk_size = min(len(ips), 50)

    hosts = {}
    now = time.strftime('%Y-%m-%d %H:%M:%S')

    for i in range(0, len(ips), chunk_size):
        chunk = ips[i:i + chunk_size]
        packet = Ether(dst="ff:ff:ff:ff:ff:ff") / ARP(pdst=chunk)
        ans, _ = srp(packet, timeout=timeout, verbose=False, iface=iface_name)

        for _, rcv in ans:
            ip = rcv.psrc
            mac = rcv.hwsrc
            if ip not in hosts:
                try:
                    vendor = mac_lookup.lookup(mac)
                except:
                    vendor = "Unknown Vendor"
                hosts[ip] = {
                    "ip": ip,
                    "mac": mac,
                    "vendor": vendor,
                    "name": "Unknown",
                    "last_seen": now,
                    "available": True,
                    "response_time": None
                }

    if check_availability:
        with ThreadPoolExecutor(max_workers=50) as executor:
            results = list(executor.map(ping_host, hosts.keys()))
            for ip, available in results:
                if ip in hosts:
                    hosts[ip]["available"] = available

    host_list = list(hosts.values())
    host_list = update_device_names(host_list)

    if verbose:
        if not host_list:
            print("[!] No response received")
        else:
            print(tabulate(host_list, headers="keys", tablefmt="fancy-grid"))
            print(f"Total Hosts Discovered: {len(host_list)}")

    return host_list

if __name__ == "__main__":
    hosts = live_host_discovery(verbose=True)
    for host in hosts:
        print(f"IP: {host['ip']}, Name: {host['name']}")