import { Link } from "react-router-dom";
import { Wrench, UserCircle, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useState, useRef } from "react";

export default function ToolsPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();
    const { logout } = useAuth();

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-orange-950 to-black text-white font-sans flex flex-col">
      {/* Navbar */}
      <header className="py-5 px-8 shadow-lg flex items-center w-full z-10 bg-opacity-80">
        <Link to="/" className="block w-fit">
          <h1 className="text-3xl font-bold tracking-wide cursor-pointer text-white">
            Netwatch
          </h1>
        </Link>
        <nav className="flex gap-8 justify-start ml-auto">
          <NavbarLink to="/network">Network</NavbarLink>
          <NavbarLink to="/internet">Internet</NavbarLink>
          <NavbarLink to="/tools">Tools</NavbarLink>
          <NavbarLink to="/rtscan">Real-Time Scan</NavbarLink>
        </nav>
          <div className="relative ml-6" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-white hover:text-gray-300 focus:outline-none"
          >
            <UserCircle size={32} className="transition-transform hover:scale-105" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-3 w-44 bg-blend-color-burn rounded-xl shadow-xl py-2 z-50 fade-in-up">
              <button
                onClick={() => {setMenuOpen(false); navigate("/profile")}}
                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-100 hover:text-blue-600 transition-colors"
              >
                <User size={16} className="mr-2" /> View Profile
              </button>
              <div className="border-t my-1" />
              <button
                onClick={() => {setMenuOpen(false); logout();}}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
              >
                <LogOut size={16} className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 lg:px-16 text-center relative">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Network Tools</h2>
        <p className="text-md lg:text-lg text-gray-200">Access powerful tools for network management</p>
        <Wrench size={40} className="text-white mx-auto mt-6" />
      </section>

      {/* Tools Section */}
      <section className="py-12 px-4 lg:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ToolBox name="Ping Test" description="Check connectivity to a specific host" to="/tools/pingtest"/>
          <ToolBox name="Traceroute" description="Trace the path packets take to a host" to="/tools/traceroute"/>
          <ToolBox name="Port Scanner" description="Scan for open ports on a host" to="/tools/portscan" />
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

function NavbarLink({ to, children }) {
  return (
    <Link to={to} className="text-white hover:underline transition duration-150 text-sm lg:text-base xl:text-lg">
      {children}
    </Link>
  );
}

function ToolBox({ name, description, to }) {
  return (
    <Link to={to} className="bg-white bg-opacity-20 rounded-xl shadow-md p-6 h-[180px] lg:h-[220px] flex flex-col items-center justify-center text-center text-gray-200 text-lg font-semibold transition duration-200 hover:-translate-y-2 hover:shadow-xl hover:text-gray-200">
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="text-sm">{description}</p>
    </Link>
  );
}