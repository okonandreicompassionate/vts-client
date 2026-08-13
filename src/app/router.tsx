import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Spinner } from '@/components/spinner';
import { paths } from "../config/paths";
import { ProtectedRoute } from "./protected-route";
import { TenantLayout } from "../lib/tenant/tenant-layout";

const LazyAdminDashboard = lazy(() => import("../features/admins/components/dashboard"));

const LazyAdminAuthPage = lazy(() => import("../features/admins/components/auth-page"));
const LazyAdminSettings = lazy(() => import("../features/admins/components/settings"));
const LazyVisitorDetails = lazy(() => import("../features/admins/components/visitor-details"));
const LazyVisitorPage = lazy(() => import("../features/admins/components/visitors-page"));
const LazyLandingPage = lazy(() => import("../features/visitors/components/landing-page"));
const LazyRegistration = lazy(() => import("../features/visitors/components/registration"));
const LazyVerifyIdentity = lazy(() => import("../features/visitors/components/verify-identity"));
const LazyVisitorProfile = lazy(() => import("../features/visitors/components/visitor-profile"));

const LazyVisitorLayout = lazy(() => import("../features/visitors/components/layout/visitor-layout"));
const LazyLayout = lazy(() => import("../features/admins/components/layout/dashboard-layout"));

const fallback = <Spinner variant="screen" />;

export function AppRouter() {
  return (
    <Suspense fallback={fallback}>
      <Routes>
        <Route element={<TenantLayout />}>
          {/* visitor */}
          <Route path={paths.home.path} element={<LazyLandingPage />} />

          <Route element={<LazyVisitorLayout />}>
            <Route
              path={paths.register.path}
              element={
                <ProtectedRoute requiredAuth="visitor-verified">
                  <LazyRegistration />
                </ProtectedRoute>
              }
            />

            <Route path={paths.verify.path} element={<LazyVerifyIdentity />} />

            <Route
              path={paths.visitorProfile.path}
              element={
                <ProtectedRoute requiredAuth="visitor">
                  <LazyVisitorProfile />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* admin auth */}
          <Route path={paths.admin.login.path} element={<LazyAdminAuthPage />} />

          <Route path={paths.admin.signup.path} element={<LazyAdminAuthPage />} />

          {/* admin app */}
          <Route
            element={
              <ProtectedRoute requiredAuth="admin">
                <LazyLayout />
              </ProtectedRoute>
            }
          >
            <Route path={paths.admin.dashboard.path} element={<LazyAdminDashboard />} />

            <Route path={paths.admin.visitors.path} element={<LazyVisitorPage />} />

            <Route path={paths.admin.visitorDetails.path} element={<LazyVisitorDetails />} />

            <Route path={paths.admin.settings.path} element={<LazyAdminSettings />} />
    
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
