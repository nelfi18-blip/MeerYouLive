import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AuthSuccessPage from "./pages/AuthSuccessPage";
import LivePage from "./pages/LivePage";
import LiveViewerPage from "./pages/LiveViewerPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/auth/success" element={<AuthSuccessPage />} />
        <Route path="/live" element={<LivePage />} />
        <Route path="/live/:id" element={<LiveViewerPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/cancel" element={<PaymentCancelPage />} />
      </Routes>
    </BrowserRouter>
  );
}
