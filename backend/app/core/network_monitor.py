import asyncio
import pyshark
import threading
import time
import nest_asyncio

# Apply nest_asyncio to allow nested event loops
nest_asyncio.apply()

class NetworkMonitor:
    def __init__(self):
        self.stats = {}
        self.is_running = False
        self.monitor_thread = None
        self.capture = None
        self._setup_event_loop()

    def _setup_event_loop(self):
        try:
            self.loop = asyncio.get_event_loop()
        except RuntimeError:
            self.loop = asyncio.new_event_loop()
            asyncio.set_event_loop(self.loop)

    def start_monitoring(self, interface):
        if not self.is_running:
            self.is_running = True
            try:
                self.capture = pyshark.LiveCapture(
                    interface=interface,
                    bpf_filter='ip',
                    use_json=True,
                )
                print(f"[+] Starting capture on {interface}")
                self.monitor_thread = threading.Thread(target=self._monitor_traffic)
                self.monitor_thread.daemon = True
                self.monitor_thread.start()
            except Exception as e:
                print(f"[-] Error starting capture: {e}")
                self.is_running = False

    def _monitor_traffic(self):
        try:
            for packet in self.capture.sniff_continuously():
                if not self.is_running:
                    break
                self._packet_callback(packet)
        except Exception as e:
            print(f"[-] Error in monitoring: {e}")
            self.is_running = False
        finally:
            if self.capture:
                self.capture.close()

    def _packet_callback(self, packet):
        try:
            if hasattr(packet, 'ip'):
                ip_src = packet.ip.src
                ip_dst = packet.ip.dst
                length = int(packet.length)
                current_time = time.time()

                for ip in [ip_src, ip_dst]:
                    if ip not in self.stats:
                        self.stats[ip] = {
                            "bytes_sent": 0,
                            "bytes_received": 0,
                            "packets_sent": 0,
                            "packets_received": 0,
                            "bandwidth_sent": 0,
                            "bandwidth_received": 0,
                            "window_start_time": current_time,
                            "window_bytes_sent": 0,
                            "window_bytes_received": 0
                        }

                    if ip == ip_src:
                        self.stats[ip]["bytes_sent"] += length
                        self.stats[ip]["packets_sent"] += 1
                        self.stats[ip]["window_bytes_sent"] += length
                    else:
                        self.stats[ip]["bytes_received"] += length
                        self.stats[ip]["packets_received"] += 1
                        self.stats[ip]["window_bytes_received"] += length

                    if current_time - self.stats[ip]["window_start_time"] >= 1.0:
                        # Calculate bandwidth in Mbps
                        self.stats[ip]["bandwidth_sent"] = (
                                self.stats[ip]["window_bytes_sent"] * 10
                        )
                        self.stats[ip]["bandwidth_received"] = (
                                self.stats[ip]["window_bytes_received"] * 8
                        )

                        # Reset window counters
                        self.stats[ip]["window_bytes_sent"] = 0
                        self.stats[ip]["window_bytes_received"] = 0
                        self.stats[ip]["window_start_time"] = current_time

        except Exception as e:
            print(f"[-] Error processing packet: {e}")

    def get_traffic_stats(self, ip):
        try:
            stats = self.stats.get(ip)
            if stats:
                return {
                    "bytes_sent": int(stats["bytes_sent"]),
                    "bytes_received": int(stats["bytes_received"]),
                    "packets_sent": int(stats["packets_sent"]),
                    "packets_received": int(stats["packets_received"]),
                    "bandwidth_sent": float(stats["bandwidth_sent"]),
                    "bandwidth_received": float(stats["bandwidth_received"])
                }
            return None
        except Exception as e:
            print(f"[-] Error getting stats for {ip}: {e}")
            return None

    def stop_monitoring(self):
        self.is_running = False
        if self.capture:
            self.capture.close()