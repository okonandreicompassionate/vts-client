interface AuthHeaderProps {
  mode: "login" | "signup";
}

export default function AuthHeader({ mode }: AuthHeaderProps) {
  const title = mode === "login" ? "" : "Create Account";
  const subtitle =
    mode === "login"
      ? "Enter your credentials to manage the portal"
      : "Fill in your details to get started";

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-200">{title}</h2>
      <p className="mt-2 text-lg font-medium text-slate-500 dark:text-slate-400 text-center">{subtitle}</p>
    </div>
  );
}
