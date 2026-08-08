interface AuthHeaderProps {
  mode: "login" | "signup";
}

export default function AuthHeader({ mode }: AuthHeaderProps) {
  if (mode === "login") return null;

  return (
    <div className="text-center">
      <p className="mt-1 text-base font-medium text-slate-900 dark:text-slate-400 mb-2">
        Fill in your details to get started
      </p>
    </div>
  );
}