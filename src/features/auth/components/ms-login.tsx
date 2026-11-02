import { useState } from "react";
import { Button, message } from "antd";
import { useMicrosoftLoginMutation } from "../api/auth-api-slice";
import { useMsalAuth } from "../api/msal-client";
import type { SignInResponse } from "../types/api-types";

interface MicrosoftLoginProps {
  onSignIn: (response: SignInResponse) => void;
}

export default function MicrosoftLogin({ onSignIn }: MicrosoftLoginProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [microsoftLogin, { isLoading }] = useMicrosoftLoginMutation();
  const msal = useMsalAuth();

  const handleClick = async () => {
    try {
      setIsPopupOpen(true);

      const msalResult = await msal.login();

      const response = await microsoftLogin({
        accessToken: msalResult.accessToken,
      }).unwrap();

      onSignIn(response);
    } catch (error) {
      console.error(error);
      message.error("Unable to login with Microsoft, please try again");
    } finally {
      setIsPopupOpen(false);
    }
  };

  return (
    <Button
      block
      size="middle"
      icon={<img src="/microsoft.png" alt="" className="h-4 w-4" />}
      loading={isPopupOpen || isLoading}
      onClick={handleClick}
      className="h-10! rounded-md! border-slate-200! text-sm! font-semibold! hover:border-slate-300! hover:bg-slate-50! dark:border-slate-600! dark:bg-slate-800! dark:text-slate-100! dark:hover:border-slate-500! dark:hover:bg-slate-700!"
    >
      Sign in with Microsoft
    </Button>
  );
}
