import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-6 transition-colors">
      <div className="max-w-lg mx-auto">
        <Link
          to="/vault"
          className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition"
        >
          <ArrowLeft size={18} />
          Back to Vault
        </Link>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>

          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Logged in as</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Appearance</p>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition text-sm"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              Switch to {theme === "dark" ? "Light" : "Dark"} Mode
            </button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              To change your account password, use the forgot password flow — it sends a verification code to your email for security.
            </p>
            <Link
              to="/forgot-password"
              className="inline-block px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition text-sm"
            >
              Change Account Password
            </Link>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-6">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/70 text-red-600 dark:text-red-400 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;