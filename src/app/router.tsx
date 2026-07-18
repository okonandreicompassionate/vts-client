import { BrowserRouter, Routes, Route } from "react-router-dom";

// use the paths in path.ts file to link or navigate files
import { paths } from "../config/paths";

// shared layout which has sidebar and react's outlet)
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
        {/* visitor side */}
        <Route path={paths.home.path} element={<LandingPage />} />
        <Route path={paths.register.path} element={<Registration />} />
        <Route path={paths.verify.path} element={<VerifyIdentity />} />

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