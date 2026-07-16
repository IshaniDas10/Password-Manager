import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Vault from "./pages/Vault";
import AddPassword from "./pages/AddPassword";
import EditPassword from "./pages/EditPassword";
import RevealPassword from "./pages/RevealPassword";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/verify-otp" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vault"
        element={
          <ProtectedRoute>
            <Vault />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vault/add"
        element={
          <ProtectedRoute>
            <AddPassword />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vault/edit/:id"
        element={
          <ProtectedRoute>
            <EditPassword />
          </ProtectedRoute>
        }
      />
     <Route
        path="/vault/reveal/:id"
        element={
          <ProtectedRoute>
            <RevealPassword />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;