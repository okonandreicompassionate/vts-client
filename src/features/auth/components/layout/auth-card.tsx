import AuthHeader from "./auth-header";
import AuthFooter from "./auth-footer";
import LoginForm from "../login-form";
import SignupForm from "../signup-form";

interface AuthCardProps {
  mode: "login" | "signup";
  onSwitchMode: () => void;
  inviteToken: string | null;
}

export default function AuthCard({ mode, onSwitchMode, inviteToken }: AuthCardProps) {
  return (
    <div className="mx-auto w-full">
      <AuthHeader mode={mode} />

      {mode === "login" ? (
        <LoginForm />
      ) : inviteToken ? (
        <SignupForm inviteToken={inviteToken} />
      ) : (
        <p className="text-center text-sm text-slate-500">
          This signup link is missing a valid invitation token.
        </p>
      )}

      <AuthFooter mode={mode} onSwitchMode={onSwitchMode} />
    </div>
  );
}
