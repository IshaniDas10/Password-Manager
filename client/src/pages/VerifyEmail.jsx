import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import AuthHeader from "../components/AuthHeader";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/auth/verify/${token}`);
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully!");

        setTimeout(() => {
          navigate("/login");
        }, 2500);

      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed or link expired.");
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 transition-colors">
      <AuthHeader />
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800 text-center">
        {status === "verifying" && (
          <p className="text-gray-500 dark:text-gray-400">Verifying your email...</p>
        )}

        {status === "success" && (
          <>
            <p className="text-green-600 dark:text-green-400 font-medium mb-2">{message}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Redirecting you to login...</p>
          </>
        )}

        {status === "error" && (
          <>
            <p className="text-red-600 dark:text-red-400 font-medium mb-4">{message}</p>
            <Link to="/login" className="text-purple-600 dark:text-purple-400 hover:underline text-sm">
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;