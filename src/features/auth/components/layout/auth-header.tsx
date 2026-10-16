interface AuthHeaderProps {
  mode: "login" | "signup";
}

export default function AuthHeader({ mode }: AuthHeaderProps) {
  return (
    <div className={`flex flex-col gap-1 ${mode === "login" ? "mb-3" : "mb-5"}`}>
      <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
        {mode === "login" ? "Sign in" : "Join Organization"}
      </h2>
      <p
        className={`leading-relaxed text-slate-500 dark:text-slate-400 ${
          mode === "login" ? "text-[9px] whitespace-nowrap" : "text-sm"
        }`}
      >
        {mode === "login"
          ? "Enter your details to access the workspace."
          : "Fill in your details to get started."}
      </p>
    </div>
  );
}
