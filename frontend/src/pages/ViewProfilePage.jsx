import { useAuth } from "./context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";

export default function ViewProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-orange-950 to-black text-white font-sans flex flex-col">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 text-white hover:text-orange-400 transition"
        >
          <ArrowLeftCircle size={28} />
        </button>

        <h1 className="text-3xl font-bold text-center mb-6">Your Profile</h1>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-400">Username</p>
            <p className="text-xl font-semibold">{user?.username || "Unknown"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
