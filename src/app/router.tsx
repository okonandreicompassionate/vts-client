import { BrowserRouter, Routes, Route } from "react-router-dom";

// Visitor-side screens
import LandingPage from "../features/visitor/components/LandingPage";
import Registration from "../features/visitor/components/Registration";
import VerifyIdentity from "../features/visitor/components/VerifyIdentity";

// Admin-side screens
import AdminLogin from "../features/admin/components/AdminLogin";
import AdminDashboard from "../features/admin/components/AdminDashboard";
import VisitorPage from "../features/admin/components/VisitorPage";
import VisitorDetails from "../features/admin/components/VisitorDetails";
import VisitorReview from "../features/admin/components/VisitorReview";
import AdminSettings from "../features/admin/components/AdminSettings";

import { PopupProvider } from "../contexts/PopupProvider";


export function AppRouter() {
  return (
    <BrowserRouter>
      <PopupProvider>
        <main>
          <Routes>
            {/* Visitor */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/verify" element={<VerifyIdentity />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/visitorpage" element={<VisitorPage />} />
            <Route path="/visitordetails" element={<VisitorDetails />} />
            <Route path="/visitorreview" element={<VisitorReview />} />
            <Route path="/adminsettings" element={<AdminSettings />} />
          </Routes>
        </main>
      </PopupProvider>
    </BrowserRouter>
  );
}