interface AuthHeaderProps {
  mode: "login" | "signup";
}

export default function AuthHeader({ mode }: AuthHeaderProps) {
  if (mode === "login") return null;

  return (
    <div className="flex flex-col -space-y-2 text-center">
      <span className="text-[16px] font-bold text-slate-900 dark:text-slate-400 mb-2">
        Join Organization
      </span>
      <span className="-mt-2 text-sm mb-3 text-slate-700 dark:text-slate-400">Fill in your details to get started</span>
    </div>
  );
}