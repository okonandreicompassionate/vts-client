import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { paths } from "@/config/paths";
import AuthLayout from "./layout/auth-layout";
import AuthCard from "./layout/auth-card";

type AuthMode = "login" | "signup";

export default function AdminAuth() {
  const navigate = useNavigate();
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const [searchParams] = useSearchParams();

  const isSignupRoute = window.location.pathname.endsWith("/signup");

  const mode: AuthMode = isSignupRoute ? "signup" : "login";

  const inviteToken = searchParams.get("invite");

  const handleSwitchMode = () => {
    if (!orgSlug) {
      return;
    }

    if (mode === "login") {
      navigate(
        inviteToken
          ? `${paths.admin.signup.getHref(orgSlug)}?invite=${encodeURIComponent(inviteToken)}`
          : paths.admin.signup.getHref(orgSlug),
      );
    } else {
      navigate(paths.admin.login.getHref(orgSlug));
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