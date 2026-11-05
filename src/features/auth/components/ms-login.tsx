import { useState } from "react";
import { Button, message } from "antd";
import { useMicrosoftLoginMutation } from "../api/auth-api-slice";
import { useMsalAuth } from "../api/msal-client";
import type { SignInResponse } from "../types/api-types";

interface MicrosoftLoginProps {
  onSignIn: (response: SignInResponse) => void;
  /** "Remember me" from the login form. */
  rememberMe?: boolean;
}

export default function MicrosoftLogin({ onSignIn, rememberMe = true }: MicrosoftLoginProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [microsoftLogin, { isLoading }] = useMicrosoftLoginMutation();
  const msal = useMsalAuth();

  const handleClick = async () => {
    try {
      setIsPopupOpen(true);

      const msalResult = await msal.login();

      const response = await microsoftLogin({
        accessToken: msalResult.accessToken,
        rememberMe,
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
      icon={<img src="/microsoft.png" alt="" className="h-4 w-4" />}
      loading={isPopupOpen || isLoading}
      onClick={handleClick}
    >
      Sign in with Microsoft
    </Button>
  );
}
