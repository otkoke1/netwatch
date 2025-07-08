from scapy.all import sniff
from collections import Counter
from threading import Lock

protocol_counter = Counter()
lock = Lock()

ANOMALY_THRESHOLD = 0.85

def classify_protocol(packet):
    try:
        if packet.haslayer("TCP"):
            return "TCP"
        elif packet.haslayer("UDP"):
            return "UDP"
        elif packet.haslayer("ICMP"):
            return "ICMP"
        elif packet.haslayer("ARP"):
            return "ARP"
        else:
            return "Other"
    except Exception:
        return "Unknown"

def packet_handler(packet):
    proto = classify_protocol(packet)
    with lock:
        protocol_counter[proto] += 1
        #print(f"Captured: {proto} → {protocol_counter[proto]}") yeah I prevented this from printing to console, it was too noisy

def start_sniffing():
    sniff(prn=packet_handler, store=False, filter="ip or arp", iface=None)

def get_protocol_stat():
    with lock:
        total = sum(protocol_counter.values())
        result = dict(protocol_counter)
        result["anomaly"] = False
        if total > 0:
            tcp_ratio = result.get("TCP", 0) / total
            if tcp_ratio >= ANOMALY_THRESHOLD:
                result["anomaly"] = True
        return result

def reset_protocol_stat():
    with lock:
        protocol_counter.clear()

