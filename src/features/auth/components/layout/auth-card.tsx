import AuthHeader from "./auth-header";
import AuthFooter from "./auth-footer";
import LoginForm from "../login-form";
import SignupForm from "../signup-form";
import { ThemeToggle } from "../../../../components/ui/theme-toggle";

interface AuthCardProps {
  mode: "login" | "signup";
  onSwitchMode: () => void;
  inviteToken: string | null;
}

export default function AuthCard({
  mode,
  onSwitchMode,
  inviteToken,
}: AuthCardProps) {
  return (
    <>
      <div className="fixed right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="mx-auto w-full max-w-sm rounded-2xl p-6 dark:border-slate-800 dark:bg-slate-950 dark:shadow-slate-950/50 sm:p-8">
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

        <AuthFooter
          mode={mode}
          onSwitchMode={onSwitchMode}
        />
      </div>
    </>
  );
}