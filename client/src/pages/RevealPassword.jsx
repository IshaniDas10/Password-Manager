import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { ArrowLeft, Copy, Eye, EyeOff } from "lucide-react";

function RevealPassword() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [otpRequested, setOtpRequested] = useState(false);
  const [otp, setOtp] = useState("");
  const [revealed, setRevealed] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/passwords/${id}/request-reveal-otp`);
      toast.success(res.data.message || "OTP sent to your email");
      setOtpRequested(true);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send OTP";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(`/passwords/${id}/verify-reveal-otp`, { otp });
      setRevealed(res.data);
      setShowPassword(true);
    } catch (error) {
      const message = error.response?.data?.message || "Invalid OTP";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!revealed) return;
    navigator.clipboard.writeText(revealed.password);
    toast.success("Password copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-6 transition-colors">
      <div className="max-w-md mx-auto">
        <Link
          to="/vault"
          className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition"
        >
          <ArrowLeft size={18} />
          Back to Vault
        </Link>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-6">Reveal Password</h1>

          {!otpRequested && (
            <>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                For your security, we'll send a one-time code to your email before revealing this password.
              </p>
              <button
                onClick={handleRequestOtp}
                disabled={loading}
                className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP to my email"}
              </button>
            </>
          )}

          {otpRequested && !revealed && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 tracking-widest text-center"
                  placeholder="123456"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Reveal"}
              </button>
            </form>
          )}

          {revealed && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                <p className="font-medium">{revealed.website}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                <p className="font-medium">{revealed.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Password</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      readOnly
                      value={revealed.password}
                      className="w-full px-4 py-2 pr-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
                    />
                    <button
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                    title="Copy password"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RevealPassword;