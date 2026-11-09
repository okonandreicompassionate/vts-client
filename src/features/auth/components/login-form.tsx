import { Form, Input, Button, Checkbox, message } from "antd";
import { Link } from "react-router-dom";
import { paths } from "@/config/paths";
import { useLoginMutation } from "../api/auth-api-slice";
import { useSignInFlow } from "../hooks/use-sign-in-flow";
import MicrosoftLogin from "./ms-login";
import OrganizationPicker from "./organization-picker";
import { emailRules, getPasswordRules } from "../utils/validation";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
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
  const rememberMe = Form.useWatch("rememberMe", form) ?? true;

  const { selection, isSelecting, handleSignIn, chooseOrganization, cancelSelection } =
    useSignInFlow();

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const response = await adminLogin({
        email: values.email.trim(),
        password: values.password,
        rememberMe: values.rememberMe,
      }).unwrap();

      handleSignIn(response, values.rememberMe);
    } catch (error) {
      console.log("Login error:", error);
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

  if (selection) {
    return (
      <OrganizationPicker
        organizations={selection.organizations}
        isSelecting={isSelecting}
        onSelect={(orgId) => void chooseOrganization(orgId)}
        onCancel={cancelSelection}
      />
    );
  }

  return (
    <Form<LoginFormValues>
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ rememberMe: true }}
    >
      <Form.Item label="Email Address" name="email" rules={emailRules}>
        <Input
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
        />
      </Form.Item>

      <Form.Item label="Password" name="password" rules={getPasswordRules({ required: true })}>
        <Input.Password
          placeholder="••••••••••"
          autoComplete="current-password"
        />
      </Form.Item>

      <div className="-mt-1 mb-4 flex items-center justify-between text-xs">
        <Form.Item name="rememberMe" valuePropName="checked" noStyle>
          <Checkbox className="text-xs! text-slate-600! dark:text-zinc-300!">
            Remember me
          </Checkbox>
        </Form.Item>
        <Link
          to={paths.admin.forgotPassword.getHref()}
          className="font-medium text-sky-500 hover:text-sky-600"
        >
          Forgot password?
        </Link>
      </div>

      <Form.Item className="mb-3! pt-1">
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={isLoading}
        >
          Sign in
        </Button>
      </Form.Item>

      <div className="pt-1">
        <MicrosoftLogin
          rememberMe={rememberMe}
          onSignIn={(response) => handleSignIn(response, rememberMe)}
        />
      </div>
    </Form>
  );
}
