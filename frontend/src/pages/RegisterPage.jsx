import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";

function LoadingSpinner() {
  return (
    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"/>
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!form.username || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:8000/api/register", {
        username: form.username,
        password: form.password
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-orange-950 to-black text-white font-sans flex items-center justify-center p-4">
      <form
        onSubmit={handleRegister}
        className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-96 animate-fade-in-up"
      >
        <h2 className="text-white text-2xl font-bold text-center mb-6">Create Account</h2>
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 text-sm rounded p-3 mb-4 animate-shake">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div className="relative group">
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full pl-10 pr-4 py-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              disabled={isLoading}
            />
            <User className="absolute left-3 top-2.5 text-white/70 group-focus-within:text-orange-500 transition-colors" size={20} />
          </div>
          <div className="relative group">
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full pl-10 pr-4 py-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              disabled={isLoading}
            />
            <Lock className="absolute left-3 top-2.5 text-white/70 group-focus-within:text-orange-500 transition-colors" size={20} />
          </div>
          <div className="relative group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full pl-10 pr-4 py-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              disabled={isLoading}
            />
            <Lock className="absolute left-3 top-2.5 text-white/70 group-focus-within:text-orange-500 transition-colors" size={20} />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-orange-600 to-orange-700 py-2 rounded-full hover:from-orange-700 hover:to-orange-800 font-semibold transition-all transform active:scale-95 mt-6 flex items-center justify-center space-x-2"
        >
          {isLoading ? <LoadingSpinner /> : "Register"}
        </button>

        <p className="mt-6 text-sm text-center text-white/70">
          Already have an account?{" "}
          <span
            onClick={() => !isLoading && navigate("/login")}
            className="text-orange-500 hover:text-orange-400 cursor-pointer font-medium"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}