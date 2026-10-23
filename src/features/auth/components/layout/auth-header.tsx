interface AuthHeaderProps {
  mode: "login" | "signup";
}

export default function AuthHeader({ mode }: AuthHeaderProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${mode === "login" ? "mb-6" : "mb-5"}`}>
      <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        {mode === "login" ? "Sign in" : "Join Organization"}
      </h2>
      <p
        className="text-sm leading-relaxed text-slate-500 dark:text-slate-400"
      >
        {mode === "login"
          ? "Enter your details to access the workspace."
          : "Fill in your details to get started."}
      </p>
    </div>
  );
}
