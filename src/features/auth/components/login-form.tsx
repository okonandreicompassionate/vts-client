import { Form, Input, Button, Checkbox, message } from "antd";
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
        errorMessage = "Unable to connect to the server. Please check your connection.";
      } else if (loginError.status === "TIMEOUT_ERROR") {
        errorMessage = "The login request timed out. Please try again.";
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
      className="[&_.ant-form-item]:mb-4"
    >
      <Form.Item name="email" rules={emailRules}>
        <Input
          type="email"
          aria-label="Email address"
          placeholder="Email address"
          size="middle"
          autoComplete="email"
          className="h-9! rounded-md! border-slate-200! bg-white! px-3! text-sm! placeholder:text-slate-400! dark:border-slate-600! dark:bg-slate-800! dark:text-slate-100! dark:placeholder:text-slate-500!"
        />
      </Form.Item>

      <Form.Item name="password" rules={getPasswordRules({ required: true })}>
        <Input.Password
          aria-label="Password"
          placeholder="Password"
          size="middle"
          autoComplete="current-password"
          className="h-10! rounded-md! border-slate-200! bg-white! px-3! text-sm! placeholder:text-slate-400! dark:border-slate-600! dark:bg-slate-800! dark:text-slate-100! dark:placeholder:text-slate-500!"
        />
      </Form.Item>

      <div className="-mt-1 mb-4 flex items-center justify-between text-xs">
        <Checkbox className="text-xs! text-slate-600! dark:text-slate-300!">
          Remember me
        </Checkbox>
        <span className="font-medium text-sky-500">Forgot password?</span>
      </div>

      <Form.Item className="mb-3! pt-1">
        <Button
          type="primary"
          htmlType="submit"
          block
          size="middle"
          loading={isLoading}
          className="h-10! rounded-md! border-0! bg-sky-500! text-sm! font-semibold! shadow-none! hover:bg-sky-600!"
        >
          Sign in
        </Button>
      </Form.Item>

      <div className="pt-1">
        <MicrosoftLogin />
      </div>

      <div
        aria-hidden="true"
        className="mt-3 flex h-10 items-center justify-center rounded-md border border-slate-200 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300"
      >
        Organization Login
      </div>
    </Form>
  );
}
