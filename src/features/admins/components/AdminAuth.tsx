import { useState } from "react";
import AuthLayout from "../components/layout/AuthLayout";
import AuthCard from "../components/AuthCard";

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