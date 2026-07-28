import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Spinner } from "../components/Spinner";

// use the paths in path.ts file to link or navigate files
import { paths } from "../config/paths";

const LazyAdminDashboard = lazy(() => import("../features/admins/components/AdminDashboard"));
const LazyAdminLogin = lazy(() => import("../features/admins/components/AdminLogin"));
const LazyAdminSettings = lazy(() => import("../features/admins/components/AdminSettings"));
const LazyVisitorDetails = lazy(() => import("../features/admins/components/VisitorDetails"));
const LazyVisitorPage = lazy(() => import("../features/admins/components/VisitorPage"));
const LazyVisitorReview = lazy(() => import("../features/admins/components/VisitorReview"));
const LazyLandingPage = lazy(() => import("../features/visitors/components/LandingPage"));
const LazyRegistration = lazy(() => import("../features/visitors/components/Registration"));
const LazyVerifyIdentity = lazy(() => import("../features/visitors/components/VerifyIdentity"));
const LazyVisitorProfile = lazy(() => import("../features/visitors/components/VisitorProfile"));
const LazyAuthLayout = lazy(() => import("../features/visitors/components/layout/AuthLayout"));
const LazyLayout = lazy(() => import("../features/admins/components/layout/Layout"));

const fallback = <Spinner />;

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={fallback}>
        <Routes>
          {/* visitor side */}
          <Route path={paths.home.path} element={<LazyLandingPage />} />
          <Route element={<LazyAuthLayout />}>
            <Route path={paths.register.path} element={<LazyRegistration />} />
            <Route path={paths.verify.path} element={<LazyVerifyIdentity />} />
            <Route path={paths.visitorProfile.path} element={<LazyVisitorProfile />} />
          </Route>

          {/* admin login*/}
          <Route path={paths.admin.login.path} element={<LazyAdminLogin />} />

          {/* admin app which has shared layout: sidebar + outlet) */}
          <Route element={<LazyLayout />}>
            <Route path={paths.admin.dashboard.path} element={<LazyAdminDashboard />} />
            <Route path={paths.admin.visitors.path} element={<LazyVisitorPage />} />
            <Route path={paths.admin.visitorDetails.path} element={<LazyVisitorDetails />} />
            <Route path={paths.admin.visitorReview.path} element={<LazyVisitorReview />} />
            <Route path={paths.admin.settings.path} element={<LazyAdminSettings />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}