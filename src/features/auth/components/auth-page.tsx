import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { paths } from "@/config/paths";

import AuthLayout from "./layout/auth-layout";
import AuthCard from "./layout/auth-card";

type AuthMode = "login" | "signup";

export default function AdminAuth() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mode: AuthMode =
    location.pathname === paths.admin.signup.path
      ? "signup"
      : "login";

  const inviteToken = searchParams.get("invite");

  const handleSwitchMode = () => {
    if (mode === "login") {
      navigate(
        inviteToken
          ? `${paths.admin.signup.path}?invite=${encodeURIComponent(inviteToken)}`
          : paths.admin.signup.path,
      );
    } else {
      navigate(paths.admin.login.path);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        mode={mode}
        onSwitchMode={handleSwitchMode}
        inviteToken={inviteToken}
      />
    </AuthLayout>
  );
}