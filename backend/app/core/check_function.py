import scapy.all as scapy

def discover_hosts(subnet_address):
    print(f"\n----- Discovering hosts on {subnet_address}")
    ans, unans = scapy.arping(subnet_address)
    ans.summary()

def main():
    subnet_address = "10.22.64.0/21"
    discover_hosts(subnet_address)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nExiting host-monitor")
        exit()
