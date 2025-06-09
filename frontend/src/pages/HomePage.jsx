import { Link } from "react-router-dom";
import { Network, Globe, Wrench, Scan } from "lucide-react";

function SidebarLink({ to, icon: Icon, children }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2 rounded transition duration-200 hover:bg-[#1B3C73] hover:underline mb-4 text-white text-lg"
    >
      {Icon && <Icon size={24} />}
      {children}
    </Link>
  );
}

export default function HomePage() {
  const boxes = Array.from({ length: 3 }, (_, i) => i);

  return (
    <div className="flex h-screen w-screen font-sans">
      {/* Sidebar */}
      <aside className="w-1/5 bg-[#052659] text-white p-6 shadow-lg min-w-[180px]">
        <div className="flex flex-col h-full justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-10 tracking-wide">
              Netwatch
            </h1>
            <nav>
              <SidebarLink to="/network" icon={Network}>
                Network
              </SidebarLink>
              <SidebarLink to="/internet" icon={Globe}>
                Internet
              </SidebarLink>
              <SidebarLink to="/tools" icon={Wrench}>
                Tools
              </SidebarLink>
              <SidebarLink to="/rtscan" icon={Scan}>
                Real-Time Scan
              </SidebarLink>
            </nav>
          </div>
          <div className="mt-10 text-sm opacity-70">
            <p>Contact</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#C1E8FF] font-sans">
        <div className="min-h-[270px] bg-[#C1E8FF] border-b border-blue-200" />
        <div className="flex-grow bg-[#7DA0CA] flex items-end justify-center px-6 pb-6">
          <div className="max-w-6xl w-full grid grid-cols-3 gap-x-16 gap-y-6 p-4">
            {boxes.map((idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md w-[240px] h-[300px] mx-auto"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}