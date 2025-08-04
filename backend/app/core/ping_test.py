from ping3 import ping
import time
import socket
import math
import requests
from backend.app.core.subnet_sniffing import get_local_subnet, get_local_ip, find_active_interface, get_gateway_ip, get_gateway_mac


def local_network_info():
    try:
        subnet = str(get_local_subnet())
        local_ip = str(get_local_ip())
        gateway_ip = str(get_gateway_ip())
        iface_name = str(find_active_interface())
        gateway_mac = str(get_gateway_mac(gateway_ip, iface_name)) if gateway_ip and iface_name else None

        return {
            "subnet": subnet,
            "local_ip": local_ip,
            "gateway_ip": gateway_ip,
            "gateway_mac": gateway_mac,
            "interface_type": iface_name,
        }
    except Exception as e:
        return {"error": str(e)}


def ping_test(host, is_internal=False):
    count = 20

    try:
        # For internal hosts, try to resolve hostname
        if is_internal:
            try:
                host_name = socket.gethostbyaddr(host)[0]
            except socket.herror:
                host_name = "Unknown"

        host_ip = socket.gethostbyname(host)

    except socket.gaierror:
        print("Invalid host name")
        return

    # Use existing local_network_info for internal IPs
    if is_internal:
        network_info = local_network_info()
        provider = "Local Network"
        location = f"Subnet: {network_info['subnet']}"
    else:
        try:
            response = requests.get(f"https://ipinfo.io/{host_ip}/json")
            data = response.json()
            provider = data.get("org", "Unknown")
            location = f"{data.get('city', 'Unknown')}, {data.get('region', '')}, {data.get('country', '')} "
        except:
            provider = "Unknown"
            location = "Unknown"

    success = 0
    rtt_list = []

    # Shorter timeout for internal network
    timeout = 1 if is_internal else 2

    for i in range(count):
        rtt = ping(host, timeout=timeout)
        if rtt is not None:
            rtt_ms = round(rtt * 1000, 2)
            rtt_list.append(rtt_ms)
            print(f"[{i+1}/{count}] successfully ping: {rtt_ms} ms")
            success += 1
        else:
            print(f"[{i+1}/{count}] timeout")
        time.sleep(0.2)

    loss = count - success
    loss_percent = (loss / count) * 100
    avg = round(sum(rtt_list)/len(rtt_list), 2) if rtt_list else 0

    if rtt_list:
        jitter = round(math.sqrt(sum((x - avg) ** 2 for x in rtt_list) / len(rtt_list)), 2)
    else:
        jitter = 0

    result = {
        "target_host": host,
        "address": host_ip,
        "provider": provider,
        "location": location,
        "success_count": success,
        "total_count": count,
        "packet_loss_percent": round(loss_percent, 2),
        "average_ping_ms": avg,
        "jitter_ms": jitter,
        "rtt_list": rtt_list
    }

    if is_internal:
        result.update({
            "hostname": host_name if 'host_name' in locals() else "Unknown",
            "network_info": network_info
        })

    return result