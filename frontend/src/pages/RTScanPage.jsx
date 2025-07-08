import { Scan } from "lucide-react";
import ProtocolPieChart from "./context/ProtocolPieChart.jsx";
import AnomalyAlert from "./context/AnomalyAlert.jsx";

export default function RTScanPage() {
  return (
    <div className="h-screen overflow-auto w-screen bg-gradient-to-r from-orange-950 to-black text-white font-sans flex flex-col">

      {/* Hero */}
      <section className="py-16 px-4 lg:px-16 text-center relative">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Live Protocol Usage</h2>
        <p className="text-md lg:text-lg text-gray-200">
          Real-time visualization of your network traffic
        </p>
        <Scan size={40} className="text-white mx-auto mt-6" />
      </section>

        <section className="py-12 px-4 lg:px-16 flex flex-col lg:flex-row gap-8 justify-center">
          {/* Pie Chart */}
          <div className="flex-1 max-w-2xl">
            <ProtocolPieChart />
          </div>

          {/* Anomaly Panel */}
          <div className="flex-1 max-w-md">
            <AnomalyAlert />
          </div>
        </section>

      {/* Footer */}
      <footer className="text-center py-6 mt-auto">
        <p className="text-sm">© 2025 Netwatch — All rights reserved</p>
        <p className="text-xs opacity-70 mt-1">Contact us at support@netwatch.io</p>
      </footer>
    </div>
  );
}
