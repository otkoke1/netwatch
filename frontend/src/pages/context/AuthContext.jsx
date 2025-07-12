import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check both storage locations
        const localToken = localStorage.getItem("token");
        const sessionToken = sessionStorage.getItem("token");
        const currentToken = localToken || sessionToken;

        if (currentToken) {
          // Set token first
          setToken(currentToken);

          // Verify token and get user data
          const userRes = await axios.get("http://localhost:8000/api/auth/me", {
            headers: { Authorization: `Bearer ${currentToken}` },
          });

          setUser(userRes.data);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear everything on error
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username, password, rememberMe = false) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("remember_me", rememberMe.toString());

      const res = await axios.post("http://localhost:8000/api/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const newToken = res.data.access_token;

      // Store token based on remember me preference
      if (rememberMe) {
        localStorage.setItem("token", newToken);
        sessionStorage.removeItem("token");
      } else {
        sessionStorage.setItem("token", newToken);
        localStorage.removeItem("token");
      }

      setToken(newToken);

      // Fetch user data
      const userRes = await axios.get("http://localhost:8000/api/auth/me", {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      setUser(userRes.data);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      token,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};