import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Spinner } from "../components/Spinner";
import { paths } from "../config/paths";
import { ProtectedRoute } from "./protected-route";
import { TenantLayout } from "../lib/tenant/tenant-layout";

const LazyAdminDashboard = lazy(() => import("../features/admins/components/AdminDashboard"));
const LazyAdminAuthPage = lazy(() => import("../features/admins/components/AuthPage"));
const LazyAdminSettings = lazy(() => import("../features/admins/components/AdminSettings"));
const LazyVisitorDetails = lazy(() => import("../features/admins/components/VisitorDetails"));
const LazyVisitorPage = lazy(() => import("../features/admins/components/VisitorPage"));

const LazyLandingPage = lazy(() => import("../features/visitors/components/LandingPage"));
const LazyRegistration = lazy(() => import("../features/visitors/components/Registration"));
const LazyVerifyIdentity = lazy(() => import("../features/visitors/components/VerifyIdentity"));
const LazyVisitorProfile = lazy(() => import("../features/visitors/components/VisitorProfile"));

const LazyVisitorLayout = lazy(() => import("../features/visitors/components/layout/layout"));

const LazyLayout = lazy(() => import("../features/admins/components/layout/Layout"));

const fallback = <Spinner />;

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={fallback}>
        <Routes>
          <Route element={<TenantLayout />}>
            {/* Visitor */}
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
    </BrowserRouter>
  );
}
