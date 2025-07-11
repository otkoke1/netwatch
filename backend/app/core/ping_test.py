from ping3 import ping
import time
import socket
import requests
import math
def ping_test(host):
    count = 20

    try:
        host_ip = socket.gethostbyname(host)
    except socket.gaierror:
        print("Invalid host name")
        return

    try:
        response = requests.get(f"https://ipinfo.io/{host_ip}/json")
        data = response.json()
        provider = data.get("org", "Unknown")
        location = f"{data.get('city', "Unknown")}, {data.get('region', '')}, {data.get('country', '')} "
    except:
        provider = "Unknown"
        location = "Unknown"

    success = 0
    rtt_list = []

    for i in range(count):
        rtt = ping(host, timeout=2)
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

    return {
        "target_host": host,
        "address": host_ip,
        "provider": provider,
        "location": location,
        "success_count": success,
        "total_count": count,
        "packet_loss_percent": round(loss_percent, 2),
        "average_ping_ms": avg,
        "jitter_ms": jitter,
        "rtt_list": rtt_list,
    }

if __name__ == "__main__":
    ping_test()