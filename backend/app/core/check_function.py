import requests
import socket

def get_network_info():
    try:
        response = requests.get("https://ipinfo.io/json")
        data = response.json()

        public_ip = data.get("ip")
        hostname = socket.getfqdn()
        isp = data.get("org")
        location = f"{data.get('city')}, {data.get('region')}, {data.get('country')}"
        timezone = data.get("timezone")

        return {
            "public_ip": public_ip,
            "hostname": hostname,
            "isp": isp,
            "location": location,
            "timezone": timezone
        }

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    network_info = get_network_info()
    print(network_info)