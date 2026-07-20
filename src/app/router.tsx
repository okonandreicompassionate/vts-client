import { BrowserRouter, Routes, Route } from "react-router-dom";

// use the paths in path.ts file to link or navigate files
import { paths } from "../config/paths";
import AdminDashboard from "../features/admins/components/AdminDashboard";
import AdminLogin from "../features/admins/components/AdminLogin";
import AdminSettings from "../features/admins/components/AdminSettings";
import VisitorDetails from "../features/admins/components/VisitorDetails";
import VisitorPage from "../features/admins/components/VisitorPage";
import VisitorReview from "../features/admins/components/VisitorReview";
import LandingPage from "../features/visitors/components/LandingPage";
import Registration from "../features/visitors/components/Registration";
import VerifyIdentity from "../features/visitors/components/VerifyIdentity";
import AuthLayout from "../features/visitors/components/layout/AuthLayout";
import Layout from "../features/admins/components/layout/Layout";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* visitor side */}
        <Route path={paths.home.path} element={<LandingPage />} />
        <Route element={<AuthLayout />}>
          <Route path={paths.register.path} element={<Registration />} />
          <Route path={paths.verify.path} element={<VerifyIdentity />} />
        </Route>

        {/* admin login*/}
        <Route path={paths.admin.login.path} element={<AdminLogin />} />

        {/* admin app which has shared layout: sidebar + outlet) */}
        <Route element={<Layout />}>
          <Route path={paths.admin.dashboard.path} element={<AdminDashboard />} />
          <Route path={paths.admin.visitors.path} element={<VisitorPage />} />
          <Route path={paths.admin.visitorDetails.path} element={<VisitorDetails />} />
          <Route path={paths.admin.visitorReview.path} element={<VisitorReview />} />
          <Route path={paths.admin.settings.path} element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
