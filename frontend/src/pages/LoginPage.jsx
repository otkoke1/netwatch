import { useState } from "react";
import {useAuth} from "./context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";

function LoadingSpinner() {
  return (
    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"/>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      await login(form.username, form.password, rememberMe);
      navigate("/");
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-orange-950 to-black text-white font-sans flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-96 animate-fade-in-up"
      >
        <h2 className="text-white text-2xl font-bold text-center mb-6">Welcome Back</h2>
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
        </div>

        <div className="flex items-center justify-between text-sm text-white/70 my-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-white/20 bg-white/20 text-orange-500 focus:ring-orange-500"
            />
            <span>Remember me</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-orange-600 to-orange-700 py-2 rounded-full hover:from-orange-700 hover:to-orange-800 font-semibold transition-all transform active:scale-95 flex items-center justify-center space-x-2"
        >
          {isLoading ? <LoadingSpinner /> : "Login"}
        </button>

        <p className="mt-6 text-sm text-center text-white/70">
          Don't have an account?{" "}
          <span
            onClick={() => !isLoading && navigate("/register")}
            className="text-orange-500 hover:text-orange-400 cursor-pointer font-medium"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}
