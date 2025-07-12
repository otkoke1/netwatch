import { useAuth } from "./context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { ArrowLeftCircle, Download } from "lucide-react";
import { useState, useEffect } from "react";

export default function ViewProfilePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: ""
  });
  const getStoredToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  useEffect(() => {
    if (user) {
      console.log("Current user data:", user); // Debug log
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || ""
      });
    }
  }, [user]);
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleCancel = () => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || ""
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const token = getStoredToken();
      const response = await fetch("http://localhost:8000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: formData.first_name || null,
          last_name: formData.last_name || null,
          email: formData.email || null
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userResponse = await fetch("http://localhost:8000/api/auth/me", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log("Updated user data:", userData); // Debug log
        setUser(userData);
        setFormData({
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          email: userData.email || ""
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const token = getStoredToken();
        const response = await fetch("http://localhost:8000/api/auth/profile", {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          localStorage.removeItem("token");
          setUser(null);
          navigate("/login");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Failed to delete account:", error);
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  const handleDownload = async () => {
    try {
      const token = getStoredToken();
      const response = await fetch("http://localhost:8000/api/auth/download-lan-info", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error("Received empty PDF file");
      }

      const filename = response.headers.get("Content-Disposition")?.split("filename=")[1]?.replace(/"/g, "")
        || `lan_report_${new Date().toISOString().slice(0,10)}.pdf`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Failed to download LAN info:", error);
      alert(`Failed to download LAN information: ${error.message}`);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-orange-950 to-black text-white font-sans flex items-center justify-center">
      <button
        onClick={() => navigate(-1)}
        className="absolute left-4 top-4 text-gray-600 hover:text-orange-500 transition"
      >
        <ArrowLeftCircle size={28} />
      </button>

      <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-md w-full max-w-3xl p-8 relative">
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          Personal info
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-white mb-6">
          <div>
            <p className="text-sm text-white">First name</p>
            {isEditing ? (
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                className="w-full px-2 py-1 rounded bg-white/20 text-white"
              />
            ) : (
              <p className="font-medium">{user?.first_name || "Not set"}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-white">Last name</p>
            {isEditing ? (
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                className="w-full px-2 py-1 rounded bg-white/20 text-white"
              />
            ) : (
              <p className="font-medium">{user?.last_name || "Not set"}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-white">Username</p>
            <p className="font-medium">{user?.username}</p>
          </div>
          <div>
            <p className="text-sm text-white">Email</p>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-2 py-1 rounded bg-white/20 text-white"
              />
            ) : (
              <p className="font-medium">{user?.email || "Not set"}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Delete Account
              </button>
              </>
              ) : (
              <>
              <button
                onClick={handleEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit Profile
              </button>
              <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1">
                <Download size={16} /> Download LAN Info (PDF)
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
