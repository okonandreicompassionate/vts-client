import { useState } from "react";
import { Button, message } from "antd";
import { useMicrosoftLoginMutation } from "../api/auth-api-slice";
import { useMsalAuth } from "../api/msal-client";
import { useCompleteLogin } from "../hooks/use-complete-login";

export default function MicrosoftLogin() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [microsoftLogin, { isLoading }] = useMicrosoftLoginMutation();
  const msal = useMsalAuth();
  const completeLogin = useCompleteLogin();

  const handleClick = async () => {
    try {
      setIsPopupOpen(true);

      const msalResult = await msal.login();

      const response = await microsoftLogin({
        accessToken: msalResult.accessToken,
      }).unwrap();

      completeLogin(response);

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
      size="large"
      icon={<img src="/microsoft.png" className="h-4 w-4" />}
      loading={isPopupOpen || isLoading}
      onClick={handleClick}
      className="h-11! rounded-lg! border-slate-200! font-semibold! hover:border-slate-300! hover:bg-slate-50! dark:border-slate-600! dark:bg-slate-800! dark:text-slate-100! dark:hover:border-slate-500! dark:hover:bg-slate-700!"
    >
      Sign in with Microsoft
    </Button>
  );
}