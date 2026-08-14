import { useState } from "react";
import AuthLayout from "./layout/auth-layout";
import AuthCard from "./layout/auth-card";

type AuthMode = "login" | "signup";

export default function AdminAuth() {
  const [mode, setMode] = useState<AuthMode>("login");

  const handleSwitchMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
  };

  return (
    <AuthLayout>
      <AuthCard mode={mode} onSwitchMode={handleSwitchMode} />
    </AuthLayout>
  );
}