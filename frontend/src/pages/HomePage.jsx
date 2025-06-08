import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Network, Globe, Wrench, Scan } from "lucide-react";

// Custom hook for window dimensions
function useWindowDimensions() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimensions;
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

export default function HomePage() {
  const { width } = useWindowDimensions();

  // Set breakpoints
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isLarge = width >= 1024; // laptop and desktop

  const boxHeight = isLarge
    ? "h-96" // same height for laptop/desktop
    : isTablet
    ? "h-80"
    : "h-64";

  const gridCols = isLarge
    ? "grid-cols-3" // always 3 columns for laptop/desktop
    : isTablet
    ? "grid-cols-2"
    : "grid-cols-1";

  const boxes = Array.from({ length: 3 });

  return (
    <div className="flex h-screen w-screen font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-1/5 bg-[#052659] text-white p-6 shadow-lg">
        <div className="flex flex-col h-full justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-12 tracking-wide">Netwatch</h1>
            <nav className="text-lg">
              <SidebarLink to="/network" icon={Network}>Network</SidebarLink>
              <SidebarLink to="/internet" icon={Globe}>Internet</SidebarLink>
              <SidebarLink to="/tools" icon={Wrench}>Tools</SidebarLink>
              <SidebarLink to="/rtscan" icon={Scan}>Real-Time Scan</SidebarLink>
            </nav>
          </div>
          <div className="mt-10 text-sm opacity-70">
            <p>Contact</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col bg-[#C1E8FF] font-sans">
        <div className="h-[40%] min-h-[200px] border-b border-blue-200" />
        <div className="h-[60%] bg-[#7DA0CA] flex items-end justify-center px-2 md:px-6 pb-6">
          <div className={`max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 md:gap-x-24 lg:gap-x-32 gap-y-8 p-3.5 md:p-4`}>
            {boxes.map((_, idx) => (
              <div key={idx} className={`bg-white rounded-xl shadow-md ${boxHeight}`} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}