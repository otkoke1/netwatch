import { Link } from "react-router-dom";
import { Globe, Network, Scan, Wrench } from "lucide-react";

export default function RTScanPage() {
  return (
    <div className="flex h-screen w-screen font-sans">
      {/* Sidebar */}
      <aside className="w-1/5 bg-[#052659] text-white p-6">
        <div>
          <Link to="/" className="block w-fit">
            <h1 className="text-3xl font-bold mb-12 tracking-wide cursor-pointer text-white">
              Netwatch
            </h1>
          </Link>
          <nav className="text-lg">
            <SidebarLink to="/network" icon={Network}>Network</SidebarLink>
            <SidebarLink to="/internet" icon={Globe}>Internet</SidebarLink>
            <SidebarLink to="/tools" icon={Wrench}>Tools</SidebarLink>
            <SidebarLink to="/rtscan" icon={Scan}>Real-Time Scan</SidebarLink>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-[#C1E8FF] flex flex-col items-start justify-start pt-12 pl-10 overflow-y-auto pb-12">
        <div className="text-2xl font-semibold text-[#052659]">
          Real-Time Packet Scanner
        </div>

        <div className="flex items-center w-full mt-16">
          <span className="text-xl font-semibold text-[#052659] mr-4">Live Capture</span>
          <div className="flex-grow max-w-[715px] min-h-0.5 bg-blue-500"></div>
        </div>

        {/* Placeholder box for packet table */}
        <div className="mt-6 w-full max-w-5xl bg-white p-6 rounded-lg shadow-md text-[#052659] text-sm">
          <p>Placeholder.</p>
        </div>

        <div className="flex items-center w-full mt-16">
          <span className="text-xl font-semibold text-[#052659] mr-4">Protocol & Threat Analysis</span>
          <div className="flex-grow max-w-[715px] min-h-0.5 bg-blue-500"></div>
        </div>

        {/* Placeholder box for charts and analysis */}
        <div className="mt-6 w-full max-w-5xl bg-white p-6 rounded-lg shadow-md text-[#052659] text-sm">
          <p>Placeholder.</p>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ to, icon: Icon, children }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-2 rounded transition duration-200 hover:bg-[#1B3C73] hover:underline mb-6 text-white"
    >
      {Icon && <Icon size={20} />}
      {children}
    </Link>
  );
}
