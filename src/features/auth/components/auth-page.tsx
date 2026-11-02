import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { paths } from "@/config/paths";
import AuthLayout from "./layout/auth-layout";
import AuthCard from "./layout/auth-card";

type AuthMode = "login" | "signup";

export default function AdminAuth() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const mode: AuthMode = pathname === paths.admin.signup.path ? "signup" : "login";

  const inviteToken = searchParams.get("invite");

  const handleSwitchMode = () => {
    if (mode === "signup") {
      navigate(paths.admin.login.getHref());
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
