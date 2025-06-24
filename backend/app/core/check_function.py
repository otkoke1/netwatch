from scapy.all import sniff, IP, TCP, UDP
from datetime import datetime


def packet_callback(pkt):
    timestamp = datetime.now().strftime('%H:%M:%S')

    if IP in pkt:
        proto = 'TCP' if TCP in pkt else 'UDP' if UDP in pkt else pkt.proto
        src = pkt[IP].src
        dst = pkt[IP].dst
        sport = pkt[TCP].sport if TCP in pkt else pkt[UDP].sport if UDP in pkt else '-'
        dport = pkt[TCP].dport if TCP in pkt else pkt[UDP].dport if UDP in pkt else '-'

        print(f"[{timestamp}] {proto:<4} {src}:{sport} → {dst}:{dport}")


# Chạy sniff
print("🔍 Listening for packets... Press Ctrl+C to stop.")
sniff(filter="ip", prn=packet_callback, store=0)



