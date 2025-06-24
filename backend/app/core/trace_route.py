from scapy.layers.inet import IP, ICMP, sr1

def traceroute(target):
    ttl = 1
    while True:
        packet = IP(dst=target, ttl=ttl) / ICMP()
        reply = sr1(packet, verbose=False, timeout=1)

        if reply is None:
            print(f"{ttl}::: No response")
        elif reply.type == 11:
            print(f"{ttl}::: Reply from {reply.src}")
        elif reply.type == 0:
            print(f"{ttl} ::: Destination reached {reply.src}")
            break
        ttl += 1

if __name__ == "__main__":
    target = input("[Host] ::: ")
    traceroute(target)