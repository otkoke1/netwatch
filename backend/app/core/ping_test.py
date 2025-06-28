from ping3 import ping
import time
import socket
import requests

def ping_test():
    host = input("Enter the host to ping (e.g., google.com): ")
    count = 30

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




    print(f" Address: {host_ip}")
    print(f" Provider: {provider}")
    print(f" Location: {location}")
    print(f" Target host: {host}")
    print(f" Number of success ping: {success}/{count}")
    print(f" Packet loss: {round(loss_percent, 2)} %")
    print(f" Average Ping: {avg} ms")

if __name__ == "__main__":
    ping_test()