import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/register", {
        username: form.username,
        password: form.password
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Register failed");
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-orange-950 to-black text-white font-sans flex items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-white text-2xl font-bold text-center mb-6">Register</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full pl-10 pr-4 py-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none"
          />
          <User className="absolute left-3 top-2.5 text-white/70" size={20} />
        </div>
        <div className="relative mb-4">
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full pl-10 pr-4 py-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none"
          />
          <Lock className="absolute left-3 top-2.5 text-white/70" size={20} />
        </div>
        <button
          type="submit"
          className="w-full bg-white text-black py-2 rounded-full hover:bg-gray-100 font-semibold transition"
        >
          Register
        </button>
        <p className="mt-4 text-sm text-center text-white/70">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="underline cursor-pointer text-white">
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
