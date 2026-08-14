import AuthHeader from "./auth-header";
import AuthFooter from "./auth-footer";
import LoginForm from "../login-form";
import SignupForm from "../signup-form";
import { ThemeToggle } from "../../../../components/ui/theme-toggle";

interface AuthCardProps {
  mode: "login" | "signup";
  onSwitchMode: () => void;
}

export default function AuthCard({ mode, onSwitchMode }: AuthCardProps) {
  return (
    <>
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      <div className={`w-full mx-auto max-w-sm rounded-2xl p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-950 dark:shadow-slate-950/50`}>
        <AuthHeader mode={mode} />
        {mode === "login" ? <LoginForm /> : <SignupForm />}
        <AuthFooter mode={mode} onSwitchMode={onSwitchMode} />
      </div>
    </>
  );
}