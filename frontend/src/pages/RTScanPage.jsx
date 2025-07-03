import { useState } from "react";
import { Scan } from "lucide-react";

export default function RTScanPage() {
  const [filter, setFilter] = useState("");
  // Placeholder data
  const packets = [
    { time: "12:00:01", src: "192.168.1.2", dst: "8.8.8.8", proto: "ICMP", len: 64 },
    { time: "12:00:02", src: "192.168.1.3", dst: "1.1.1.1", proto: "TCP", len: 128 },
  ];

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-orange-950 to-black text-white font-sans flex flex-col">

      {/* Hero Section */}
      <section className="py-16 px-4 lg:px-16 text-center relative">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Real-Time Packet Scanner</h2>
        <p className="text-md lg:text-lg text-gray-200">Analyze live network traffic and detect threats</p>
        <Scan size={40} className="text-white mx-auto mt-6" />
      </section>

      {/* Real-Time Capture Controls */}
      <section className="flex flex-col items-center gap-4 px-4"><div className="flex flex-wrap gap-3 mb-4">
          <button className="px-4 py-2 rounded border border-white/20 text-white bg-transparent hover:border-green-500 transition duration-150">
            Start
          </button>
          <button className="px-4 py-2 rounded border border-white/20 text-white bg-transparent hover:border-red-500 transition duration-150">
            Stop
          </button>
          <button className="px-4 py-2 rounded border border-white/20 text-white bg-transparent hover:border-blue-500 transition duration-150">
            Export
          </button>
          <input
            type="text"
            placeholder="Filter by protocol (e.g. TCP)"
            className="px-3 py-2 rounded bg-transparent border border-white/20 text-white placeholder-white focus:border-yellow-400 transition duration-150"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>

        {/* Packet Table */}
        <div className="w-full max-w-6xl overflow-x-auto">
          <table className="min-w-full table-fixed text-sm font-mono border-collapse">
            <thead className="bg-gray-800 text-gray-200 uppercase tracking-wider">
              <tr>
                <th className="px-2 py-1 w-[80px] text-left">Time</th>
                <th className="px-2 py-1 w-[180px] text-left">Source IP</th>
                <th className="px-2 py-1 w-[180px] text-left">Dest IP</th>
                <th className="px-2 py-1 w-[100px] text-left">Protocol</th>
                <th className="px-2 py-1 w-[60px] text-left">Len</th>
              </tr>
            </thead>
            <tbody>
              {packets
                .filter(pkt => !filter || pkt.proto.toLowerCase().includes(filter.toLowerCase()))
                .map((pkt, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-700 border-b border-gray-800 cursor-pointer"
                  >
                    <td className="px-2 py-1 text-left text-gray-300">{pkt.time}</td>
                    <td className="px-2 py-1 text-left text-green-400">{pkt.src}</td>
                    <td className="px-2 py-1 text-left text-red-400">{pkt.dst}</td>
                    <td className={`px-2 py-1 text-left font-bold ${
                      pkt.proto === "TCP" ? "text-blue-400" :
                      pkt.proto === "UDP" ? "text-yellow-400" :
                      pkt.proto === "ICMP" ? "text-purple-400" :
                      "text-gray-300"
                    }`}>
                      {pkt.proto}
                    </td>
                    <td className="px-2 py-1 text-left text-white">{pkt.len}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </section>

      {/* Footer ... (keep your existing footer code) */}
    </div>
  );
}