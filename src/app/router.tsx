import { BrowserRouter, Routes, Route } from "react-router-dom";
// shared layout (Sidebar + react's Outlet)
import Layout from "../features/admin/components/layout/Layout";

// visitor-side screens
import LandingPage from "../features/visitor/components/LandingPage";
import Registration from "../features/visitor/components/Registration";
import VerifyIdentity from "../features/visitor/components/VerifyIdentity";

// admin-side screens
import AdminLogin from "../features/admin/components/AdminLogin";
import AdminDashboard from "../features/admin/components/AdminDashboard";
import VisitorPage from "../features/admin/components/VisitorPage";
import VisitorDetails from "../features/admin/components/VisitorDetails";
import VisitorReview from "../features/admin/components/VisitorReview";
import AdminSettings from "../features/admin/components/AdminSettings";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* visitor side*/}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/verify" element={<VerifyIdentity />} />

        {/* admin login (standalone, no sidebar) */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* admin app (shared Layout: Sidebar + Outlet) */}
        {/* todo: wrap in ProtectedRoute component later */}
        <Route element={<Layout />}>
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/visitorpage" element={<VisitorPage />} />
          <Route path="/visitordetails" element={<VisitorDetails />} />
          <Route path="/visitorreview" element={<VisitorReview />} />
          <Route path="/adminsettings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}