import { Button } from "antd";

interface AuthFooterProps {
  mode: "login" | "signup";
  onSwitchMode: () => void;
}

export default function AuthFooter({ mode, onSwitchMode }: AuthFooterProps) {
  const isLogin = mode === "login";

  if (isLogin) {
    return (
      <div className="mt-3 text-center">
        <p className="text-[9px] text-slate-600 dark:text-slate-300">
          New Organization? <span className="font-medium text-sky-500">Register here</span>
        </p>
        <p className="mt-2 text-[8px] text-slate-400 dark:text-slate-500">
          Need help? Contact your system administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <span className="text-[13px] text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Button
          type="link"
          className="px-0.5! text-[13px]! font-semibold! text-sky-500! hover:text-sky-600!"
          onClick={onSwitchMode}
        >
          Login
        </Button>
      </span>
    </div>
  );
}
