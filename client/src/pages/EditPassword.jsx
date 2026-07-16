import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { ArrowLeft, RefreshCw, Eye, EyeOff, Lock } from "lucide-react";

function EditPassword() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("");
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const [wantsPasswordChange, setWantsPasswordChange] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(null);
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    const loadEntry = async () => {
      try {
        const res = await api.get("/passwords");
        const entry = res.data.data.find((p) => p.id === Number(id));

        if (!entry) {
          toast.error("Password not found");
          navigate("/vault");
          return;
        }

        setWebsite(entry.website);
        setUsername(entry.username);
        setNotes(entry.notes || "");
        setCategory(entry.category || "");
      } catch (error) {
        toast.error("Failed to load password");
        navigate("/vault");
      } finally {
        setFetching(false);
      }
    };

    loadEntry();
  }, [id, navigate]);

  useEffect(() => {
    if (!newPassword) {
      setStrength(null);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await api.post("/strength", { password: newPassword });
        setStrength(res.data);
      } catch (error) {
        // ignore
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [newPassword]);

  const handleGenerate = async () => {
    try {
      const res = await api.post("/generator", {
        length: 16,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
      });
      setNewPassword(res.data.generatedPassword);
      setShowPassword(true);
    } catch (error) {
      toast.error("Failed to generate password");
    }
  };

  const handleRequestOtp = async () => {
    setOtpLoading(true);
    try {
      const res = await api.post(`/passwords/${id}/request-reveal-otp`);
      toast.success(res.data.message || "OTP sent to your email");
      setOtpRequested(true);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send OTP";
      toast.error(message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpLoading(true);

    try {
      await api.post(`/passwords/${id}/verify-reveal-otp`, { otp });
      toast.success("Identity verified — you can now set a new password");
      setOtpVerified(true);
    } catch (error) {
      const message = error.response?.data?.message || "Invalid OTP";
      toast.error(message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { website, username, notes, category };

      if (wantsPasswordChange && otpVerified) {
        payload.password = newPassword;
      }

      await api.put(`/passwords/${id}`, payload);

      toast.success("Password entry updated");
      navigate("/vault");

    } catch (error) {
      const message = error.response?.data?.message || "Failed to update password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-6 transition-colors">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold mb-6">Edit Password</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Website</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Username / Email</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Category (optional)</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
              {!wantsPasswordChange && (
                <button
                  type="button"
                  onClick={() => setWantsPasswordChange(true)}
                  className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                >
                  <Lock size={16} />
                  Change password (requires OTP verification)
                </button>
              )}

              {wantsPasswordChange && !otpRequested && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                    We'll send a one-time code to your email to confirm it's really you before changing this password.
                  </p>
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={otpLoading}
                    className="w-full py-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition disabled:opacity-50"
                  >
                    {otpLoading ? "Sending..." : "Send OTP to my email"}
                  </button>
                </div>
              )}

              {wantsPasswordChange && otpRequested && !otpVerified && (
                <div className="space-y-3">
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 tracking-widest text-center"
                    placeholder="123456"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpLoading}
                    className="w-full py-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition disabled:opacity-50"
                  >
                    {otpLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              )}

              {wantsPasswordChange && otpVerified && (
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">New Password</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                        name="new-password-field"
                        className="w-full px-4 py-2 pr-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerate}
                      className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                      title="Generate strong password"
                    >
                      <RefreshCw size={18} />
                    </button>
                  </div>

                  {strength && (
                    <div className="mt-2">
                      <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${((strength.score + 1) / 5) * 100}%`,
                            backgroundColor: strength.color,
                          }}
                        />
                      </div>
                      <p className="text-xs mt-1" style={{ color: strength.color }}>
                        {strength.strength} · crack time: {strength.crackTime}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditPassword;