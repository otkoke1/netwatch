
from fastapi import APIRouter, HTTPException, FastAPI

from scapy.layers.inet import IP, ICMP, sr1

get_traceroute_router = APIRouter()

@get_traceroute_router.get("/traceroute")

def run_traceroute(target: str, max_hops: int = 30):
    ttl = 1
    result = []

    while ttl <= max_hops:
        pkt = IP(dst=target, ttl=ttl) / ICMP()
        reply = sr1(pkt, verbose=False, timeout=1)

        if reply is None:
            result.append({"hop" : ttl, "ip" : None, "status" : "No response"})
        elif reply.type == 11:
            result.append({"hop" : ttl, "ip" : reply.src, "status" : "reply"})
        elif reply.type == 0:
            result.append({"hop" : ttl, "ip" : reply.src, "status" : "Destination reached"})
            break
        ttl +=1

    return result





