import {Link} from "react-router-dom";
import {Globe, Network, Scan, Wrench} from "lucide-react";
import {useEffect, useState} from "react";

export default function NetworkPage(){
    const [subnet, setSubnet] = useState("");

    const handleScan = async () => {
        try {
            const respone = await fetch("http://localhost:8000/subnet");
            const data = await respone.json();
            if (data.subnet){
                setSubnet(data.subnet);
            } else {
                setSubnet("Error: " +data.error);
            }
        }catch (err){
            setSubnet("Error: Could not connect to the backend")
        }
    };

    return(
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <aside className="w-1/5 bg-[#052659] text-white p-6">
        <div>
            <h1 className="text-3xl font-bold mb-12 tracking-wide">Netwatch</h1>
            <nav className="text-lg">
              <SidebarLink to="/network" icon={Network}>Network</SidebarLink>
              <SidebarLink to="#" icon={Globe}>Internet</SidebarLink>
              <SidebarLink to="#" icon={Wrench}>Tools</SidebarLink>
              <SidebarLink to="/rtscan" icon={Scan}>Real-Time Scan</SidebarLink>
            </nav>
        </div>
      </aside>
      <main className="flex-1 bg-[#C1E8FF] flex flex-col items-start justify-start pt-12 pl-10">
        <div className="text-2xl font-semibold text-[#052659]">
          Your Subnet: <span className="font-bold"> {subnet} </span>
        </div>
          <button   className="mt-1 px-2 py-0 bg-[#1B3C73] text-white font-semibold rounded-lg shadow-md hover:bg-[#144272] transition duration-200"
            onClick={handleScan}> Scan
          </button>
      </main>
    </div>
    );
}

function SidebarLink({ to, icon: Icon, children }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-2 rounded transition duration-200 hover:bg-[#1B3C73] hover:underline mb-6">
      {Icon && <Icon size={20} />}
      {children}
    </Link>
  );
}
