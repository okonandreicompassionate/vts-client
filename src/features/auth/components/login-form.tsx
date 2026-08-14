import { Form, Input, Button, message } from "antd";
import { useLoginMutation } from "../api/auth-api-slice";
import { useCompleteLogin } from "../../auth/hooks/use-complete-login";
import MicrosoftLogin from "./ms-login";
import { emailRules, getPasswordRules } from "../utils/validation";

interface LoginFormValues {
  email: string;
  password: string;
}

type LoginError = {
  status?: number | string;
  data?: {
    message?: string | string[];
    error?: string;
    statusCode?: number;
  };
};

export default function LoginForm() {
  const [form] = Form.useForm<LoginFormValues>();

  const [adminLogin, { isLoading }] = useLoginMutation();

  const completeLogin = useCompleteLogin();

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const response = await adminLogin({
        email: values.email.trim(),
        password: values.password,
      }).unwrap();

      completeLogin(response);
    } catch (error) {
      const loginError = error as LoginError;

      const backendMessage = loginError.data?.message;

      let errorMessage = "Unable to login. Please check your credentials.";

      if (Array.isArray(backendMessage)) {
        errorMessage = backendMessage.join(", ");
      } else if (typeof backendMessage === "string") {
        errorMessage = backendMessage;
      } else if (loginError.status === "FETCH_ERROR") {
        errorMessage =
          "Unable to connect to the server. Please check your connection.";
      } else if (loginError.status === "TIMEOUT_ERROR") {
        errorMessage =
          "The login request timed out. Please try again.";
      }

      message.error(errorMessage);
    }
  };

  return (
    <Form<LoginFormValues>
      form={form}
      layout="vertical"
      requiredMark={false}
      onFinish={handleSubmit}
    >
      <Form.Item
        label={
          <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
            Email Address
          </span>
        }
        name="email"
        rules={emailRules}
      >
        <Input
          type="email"
          placeholder="you@example.com"
          size="large"
          autoComplete="email"
          className="rounded-lg! border-slate-200! bg-slate-50! hover:border-slate-300! focus:border-sky-400! focus:bg-white! dark:border-slate-600! dark:bg-slate-700! dark:text-slate-100! dark:hover:border-slate-500! dark:focus:border-sky-400! dark:focus:bg-slate-800!"
        />
      </Form.Item>

      <Form.Item
        label={
          <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
            Password
          </span>
        }
        name="password"
        rules={getPasswordRules({ required: true })}
      >
        <Input.Password
          placeholder="••••••••••"
          size="large"
          autoComplete="current-password"
          className="rounded-lg! border-slate-200! bg-slate-50! hover:border-slate-300! focus:border-sky-400! focus:bg-white! dark:border-slate-600! dark:bg-slate-700! dark:hover:border-slate-500! dark:focus:border-sky-400! dark:focus:bg-slate-800!"
        />
      </Form.Item>

      <Form.Item className="mb-3 pt-1">
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={isLoading}
          className="h-10! rounded-lg! border-0! bg-sky-500! font-semibold! shadow-md! hover:bg-sky-600! hover:shadow-lg!"
        >
          Login
        </Button>
      </Form.Item>

      <div className="relative flex items-center justify-center py-2">
        <div className="absolute right-0 left-0 border-t border-slate-200 dark:border-slate-700" />

        <span className="relative bg-white px-3 text-xs font-medium text-slate-400 dark:bg-slate-900 dark:text-slate-500">
          or
        </span>
      </div>

      <div className="mb-1.5">
        <MicrosoftLogin />
      </div>

      {/* Forgot Password */}
      {/* <div className="text-center">
        <Button
          type="link"
          className="px-0! text-[13px]! font-medium! text-sky-500! hover:text-sky-600!"
        >
          Forgot Password?
        </Button>
      </div> */}
    </Form>
  );
}