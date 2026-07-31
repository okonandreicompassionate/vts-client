import AuthHeader from "../components/AuthHeader";
import AuthFooter from "../components/AuthFooter";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

interface AuthCardProps {
  mode: "login" | "signup";
  onSwitchMode: () => void;
}

export default function AuthCard({ mode, onSwitchMode }: AuthCardProps) {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/30 sm:p-8">
      <AuthHeader mode={mode} />
      {mode === "login" ? <LoginForm /> : <SignupForm />}
      <AuthFooter mode={mode} onSwitchMode={onSwitchMode} />
    </div>
  );
}