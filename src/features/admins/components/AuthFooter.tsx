import { Button } from "antd";

interface AuthFooterProps {
  mode: "login" | "signup";
  onSwitchMode: () => void;
}

export default function AuthFooter({ mode, onSwitchMode }: AuthFooterProps) {
  const isLogin = mode === "login";
  const prompt = isLogin ? "Don't have an account?" : "Already have an account?";
  const actionText = isLogin ? "Sign Up" : "Login";

  return (
    <div className="mt-6 text-center">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        {prompt}{" "}
        <Button
          type="link"
          className="px-1! text-sm! font-semibold! text-sky-500! hover:text-sky-600!"
          onClick={onSwitchMode}
        >
          {actionText}
        </Button>
      </span>
    </div>
  );
}
