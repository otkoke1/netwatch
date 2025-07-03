from scapy.layers.inet import IP, ICMP, sr1
import os
import geoip2.database
import requests
import ipaddress

CITY_DB_PATH = os.path.join(os.path.dirname(__file__), '..GeoLite2-City.mmdb')
COUNTRY_DB_PATH = os.path.join(os.path.dirname(__file__), '..GeoLite2-Country.mmdb')

def get_geo_info(ip):
    try:
        with geoip2.database.Reader(CITY_DB_PATH) as reader:
            response = reader.city(ip)
            city = response.city.name
            country = response.country.name
            if city or country:
                return city, country
    except Exception:
        pass
    try:
        with geoip2.database.Reader(COUNTRY_DB_PATH) as reader:
            response = reader.country(ip)
            country = response.country.name
            if country:
                return None, country
    except Exception:
        pass
    try:
        resp = requests.get(f"http://ip-api.com/json/{ip}", timeout=2)
        data = resp.json()
        if data.get("status") == "success":
            return data.get("city"), data.get("country")
    except Exception:
        pass
    return None, None

def is_public_ip(ip):
    try:
        return ipaddress.ip_address(ip).is_global
    except Exception:
        return False

def traceroute(target, max_hops=30):
    ttl = 1
    hops = []
    while ttl <= max_hops:
        packet = IP(dst=target, ttl=ttl) / ICMP()
        reply = sr1(packet, verbose=False, timeout=1)
        hop_data = {"hop": ttl, "ip": None, "status": "No response", "city": None, "country": None}
        if reply is None:
            hop_data["status"] = "No response"
        elif reply.type == 11:
            hop_data["ip"] = reply.src
            hop_data["status"] = "Source" if ttl == 1 else "Intermediate"
        elif reply.type == 0:
            hop_data["ip"] = reply.src
            hop_data["status"] = "destination"
            if is_public_ip(reply.src):
                city, country = get_geo_info(reply.src)
                hop_data["city"] = city
                hop_data["country"] = country
            hops.append(hop_data)
            break
        else:
            hop_data["status"] = f"Unexpected reply type {reply.type}"
        if hop_data["ip"] and is_public_ip(hop_data["ip"]):
            city, country = get_geo_info(hop_data["ip"])
            hop_data["city"] = city
            hop_data["country"] = country
        hops.append(hop_data)
        ttl += 1
    return hops

if __name__ == "__main__":
    target = input("[Host] ::: ")
    for hop in traceroute(target):
        print(f"{hop['hop']} ::: {hop['status']} {hop['ip'] or ''}")