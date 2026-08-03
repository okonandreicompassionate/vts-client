import { Form, Input, Button, message } from "antd";
import { useAdminLoginMutation } from "../api/admin-api";
import { getAuthToken } from "../utils/get-auth-token";
import { useCompleteLogin } from "../hooks/use-complete-login";
import MicrosoftLogin from "../components/ms-login";
import { emailRules, getPasswordRules } from "../utils/validation";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [form] = Form.useForm<LoginFormValues>();
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const completeLogin = useCompleteLogin();

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const response = await adminLogin({
        email: values.email,
        password: values.password,
      }).unwrap();

      completeLogin(getAuthToken(response));
      message.success("Login successful");
    } catch (error) {
      console.error(error);
      message.error("Unable to login, please check your credentials.");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      requiredMark={false}
      className="space-y-1"
    >
      {/* Email */}
      <Form.Item
        label={<span className="text-sm font-semibold text-slate-700">Email Address</span>}
        name="email"
        rules={emailRules}
      >
        <Input
          placeholder="admin@zoracom.com"
          size="large"
          className="rounded-lg! border-slate-200! bg-slate-50! hover:border-slate-300! focus:border-sky-400! focus:bg-white!"
        />
      </Form.Item>

      {/* Password */}
      <Form.Item
        label={<span className="text-sm font-semibold text-slate-700">Password</span>}
        name="password"
        rules={getPasswordRules({ required: true })}
      >
        <Input.Password
          placeholder="••••••••••"
          size="large"
          className="rounded-lg! border-slate-200! bg-slate-50! hover:border-slate-300! focus:border-sky-400! focus:bg-white!"
        />
      </Form.Item>

      {/* Submit */}
      <Form.Item className="mb-3 pt-2">
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={isLoading}
          className="h-11! rounded-lg! border-0! bg-sky-500! font-semibold! shadow-md! hover:bg-sky-600! hover:shadow-lg!"
        >
          Login
        </Button>
      </Form.Item>

      {/* Microsoft Login */}
      <div className="relative flex items-center justify-center py-3">
        <div className="absolute right-0 left-0 border-t border-slate-200" />
        <span className="relative bg-white px-3 text-xs font-medium text-slate-400">or</span>
      </div>

      <div className="mb-3">
        <MicrosoftLogin />
      </div>

      {/* Forgot Password */}
      <div className="text-center">
        <Button
          type="link"
          className="px-0! text-sm! font-medium! text-sky-500! hover:text-sky-600!"
        >
          Forgot Password?
        </Button>
      </div>
    </Form>
  );
}