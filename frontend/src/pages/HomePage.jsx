import { Link } from "react-router-dom";
import { Network, Globe, Wrench, Scan } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex h-screen w-screen font-sans">
      {/* Sidebar */}
      <aside className="w-1/5 bg-[#052659] text-white p-6 shadow-lg">
        <div className="flex flex-col h-full justify-between">
          {/* Top */}
          <div>
          <h1 className="text-3xl font-bold mb-12 tracking-wide">Netwatch</h1>
            <nav className="text-lg">
              <SidebarLink to="/network" icon={Network}>Network</SidebarLink>
              <SidebarLink to="/" icon={Globe}>Internet</SidebarLink>
              <SidebarLink to="#" icon={Wrench}>Tools</SidebarLink>
              <SidebarLink to="/rtscan" icon={Scan}>Real-Time Scan</SidebarLink>
            </nav>
          </div>

          {/* Bottom */}
          <div className="mt-10 text-sm opacity-70">
            <p>© 2025 Netwatch</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col bg-[#C1E8FF] font-sans">
        <div className="h-[40%] border-b border-blue-200" />
        <div className="h-[60%] bg-[#7DA0CA] flex items-end justify-center gap-28 px-10 pb-6">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-lg flex-1 max-w-[250px] h-72"
            />
          ))}
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
