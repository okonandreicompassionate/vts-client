import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Spinner } from "../components/Spinner";
import { paths } from "../config/paths";
import { ProtectedRoute } from "./protected-route";

import { TenantProvider } from "../lib/tenant";

const LazyAdminDashboard = lazy(() => import("../features/admins/components/AdminDashboard"));
const LazyAdminAuthPage = lazy(() => import("../features/admins/components/AdminAuth"));
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
          {/* All tenant routes */}
          <Route
            path=":orgSlug" element={<TenantLayout />}
            
          >
            {/* Visitor */}
            <Route index element={<LazyLandingPage />} />

            <Route element={<LazyAuthLayout />}>
              <Route
                path="register"
                element={
                  <ProtectedRoute requiredAuth="visitor-verified">
                    <LazyRegistration />
                  </ProtectedRoute>
                }
              />

              <Route path="verify" element={<LazyVerifyIdentity />} />

              <Route
                path="profile"
                element={
                  <ProtectedRoute requiredAuth="visitor">
                    <LazyVisitorProfile />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Admin auth */}
            <Route path="admin" element={<LazyAdminAuthPage />} />
            <Route path="admin/signup" element={<LazyAdminAuthPage />} />

            {/* Admin application */}
            <Route
              element={
                <ProtectedRoute requiredAuth="admin">
                  <LazyLayout />
                </ProtectedRoute>
              }
            >
              <Route path="admin/dashboard" element={<LazyAdminDashboard />} />
              <Route path="admin/visitors" element={<LazyVisitorPage />} />
              <Route path="admin/visitors/:id" element={<LazyVisitorDetails />} />
              <Route path="admin/visitors/:id/review" element={<LazyVisitorReview />} />
              <Route path="admin/settings" element={<LazyAdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
