import type { ReactElement } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { useAuth } from "../lib/auth";
import { DashboardPage } from "../pages/DashboardPage";
import { HomePage } from "../pages/HomePage";
import { InvitePage } from "../pages/InvitePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { SessionPage } from "../pages/SessionPage";

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? children : <Navigate to="/login" replace state={{ authRequired: true, from: location.pathname }} />;
}

export default function App() {
  return (
    <div className="terminal-grid terminal-frame min-h-screen overflow-x-hidden">
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/invite" element={<ProtectedRoute><InvitePage /></ProtectedRoute>} />
          <Route path="/invite/:inviteKey" element={<ProtectedRoute><InvitePage /></ProtectedRoute>} />
          <Route path="/session" element={<ProtectedRoute><SessionPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </div>
  );
}
