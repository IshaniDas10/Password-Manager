import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { Plus, Search, Pencil, Trash2, Eye, LogOut, LayoutDashboard, Settings as SettingsIcon, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Vault() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchPasswords = async () => {
    setLoading(true);
    try {
      const res = await api.get("/passwords");
      setPasswords(res.data.data);
    } catch (error) {
      toast.error("Failed to load passwords");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      fetchPasswords();
      return;
    }

    try {
      const res = await api.get(`/passwords/search?query=${encodeURIComponent(query)}`);
      setPasswords(res.data.data);
    } catch (error) {
      toast.error("Search failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this password? This cannot be undone.")) return;

    try {
      await api.delete(`/passwords/${id}`);
      toast.success("Password deleted");
      setPasswords((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      toast.error("Failed to delete password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-6 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold">Password Vault</h1>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            <SettingsIcon size={18} />
            Settings
          </Link>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by website or username..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            Search
          </button>
        </form>

        <Link
          to="/vault/add"
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition font-medium"
        >
          <Plus size={18} />
          Add Password
        </Link>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : passwords.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No passwords saved yet.</p>
      ) : (
        <div className="space-y-3">
          {passwords.map((p) => (
            <div
              key={p.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                {p.faviconUrl && (
                  <img src={p.faviconUrl} alt="" className="w-8 h-8 rounded" />
                )}
                <div>
                  <p className="font-medium">{p.website}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{p.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/vault/reveal/${p.id}`)}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                  title="Reveal password"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => navigate(`/vault/edit/${p.id}`)}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/70 text-red-600 dark:text-red-400 transition"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Vault;