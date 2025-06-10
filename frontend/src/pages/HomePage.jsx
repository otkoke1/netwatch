import { Link } from "react-router-dom";
import { Network, Globe, Wrench, Scan, Router, MonitorSmartphone} from  "lucide-react";

function SidebarLink({ to, icon: Icon, children }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2 rounded transition duration-200 hover:bg-[#1B3C73] hover:underline mb-4 text-white text-base lg:text-lg xl:text-xl"
    >
      {Icon && <Icon size={20} className="lg:size-6 xl:size-7" />}
      {children}
    </Link>
  );
}

export default function HomePage() {
  const boxes = Array.from({ length: 3 }, (_, i) => i);

  return (
    <div className="flex h-screen w-screen font-sans">
      {/* Sidebar */}
      <aside className="w-1/4 lg:w-1/5 xl:w-1/6 min-w-[120px] lg:min-w-[180px] xl:min-w-[220px] bg-[#052659] text-white p-4 lg:p-6 xl:p-8 shadow-lg">
        <div className="flex flex-col h-full justify-between">
          <div>
            <h1 className="text-xl lg:text-3xl xl:text-4xl font-bold mb-6 lg:mb-10 xl:mb-12 tracking-wide">
              Netwatch
            </h1>
            <div className="flex-grow max-w-[569px] min-h-0.5 bg-white"></div>
            <br></br>
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
          <div className="mt-6 lg:mt-10 xl:mt-14 text-xs lg:text-sm xl:text-base opacity-70">
            <p>Contact</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#C1E8FF] font-sans">
        <div className="min-h-[180px] lg:min-h-[270px] xl:min-h-[360px] bg-[#C1E8FF] border-b border-blue-200 flex flex-col items-center justify-center relative">
          <MonitorSmartphone size={34} className="text-black -mt-40 absolute" style={{ right: '39%' }} />
          <div className="absolute bg-black w-[2px] h-[80px]" style={{ right: '40%', top: '50%', transform: 'translateY(-50%)' }}></div>
          <Router size={34} className="text-black absolute -mb-40" style={{ right: '39%' }} />
        </div>
        <div className="flex-grow bg-[#7DA0CA] flex items-end justify-center px-2 lg:px-6 xl:px-8 pb-4 lg:pb-6 xl:pb-8">
          <div className="max-w-3xl lg:max-w-5xl xl:max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-x-4 lg:gap-x-12 xl:gap-x-56 gap-y-4 lg:gap-y-6 xl:gap-y-8 p-2 lg:p-4 xl:p-6">
            {boxes.map((idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md w-[120px] h-[150px] lg:w-[240px] lg:h-[300px] xl:w-[280px] xl:h-[380px] mx-auto"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}