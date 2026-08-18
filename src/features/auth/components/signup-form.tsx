import { Form, Input, Button, message } from "antd";

import {
  getPasswordRules,
  getConfirmPasswordRules,
} from "../utils/validation";
import { useJoinOrganizationWithPasswordMutation } from "../api/auth-api-slice";
import { useCompleteLogin } from "../hooks/use-complete-login";

interface SignupFormValues {
  fullName: string;
  password: string;
  phoneNumber: string;
  confirmPassword: string;
}

const inputClass =
  "rounded-lg! h-8 border-slate-200! bg-slate-50! hover:border-slate-300! focus:border-sky-400! focus:bg-white! dark:border-slate-600! dark:bg-slate-700! dark:hover:border-slate-500! dark:focus:border-sky-400! -mt-2 dark:focus:bg-slate-800!";

interface SignupFormProps {
  inviteToken: string;
}

export default function SignupForm({
  inviteToken,
}: SignupFormProps) {
  const [form] = Form.useForm<SignupFormValues>();

  const completeLogin = useCompleteLogin();

  const [
    joinOrganization,
    { isLoading: isJoining },
  ] = useJoinOrganizationWithPasswordMutation();

  const handleSubmit = async (values: SignupFormValues) => {
    try {
      const result = await joinOrganization({
        fullName: values.fullName.trim(),
        phoneNumber: values.phoneNumber.trim(),
        password: values.password,
        inviteToken,
      }).unwrap();

      message.success("Account created successfully.");

      completeLogin(result);
    } catch {
      message.error(
        "Unable to complete account setup. Please try again.",
      );
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      requiredMark={false}
    >
      <Form.Item
        label={
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Full Name
          </span>
        }
        name="fullName"
        rules={[
          {
            required: true,
            message: "Please enter your full name",
          },
        ]}
        className="mb-2!"
      >
        <Input
          size="small"
          className={inputClass}
        />
      </Form.Item>

      <Form.Item
        label={
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Phone Number
          </span>
        }
        name="phoneNumber"
        rules={[
          {
            required: true,
            message: "Please enter your phone number",
          },
        ]}
        className="mb-4!"
      >
        <Input
          size="small"
          className={inputClass}
        />
      </Form.Item>

      <Form.Item
        label={
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Password
          </span>
        }
        name="password"
        rules={getPasswordRules({ minLength: 8 })}
        hasFeedback
        className="mb-4!"
      >
        <Input.Password
          placeholder="••••••••••"
          size="small"
          className={inputClass}
        />
      </Form.Item>

      <Form.Item
        label={
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Confirm Password
          </span>
        }
        name="confirmPassword"
        dependencies={["password"]}
        hasFeedback
        rules={getConfirmPasswordRules("password")}
        className="mb-5!"
      >
        <Input.Password
          placeholder="••••••••••"
          size="small"
          className={inputClass}
        />
      </Form.Item>

      <Form.Item className="mb-0!">
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={isJoining}
          disabled={isJoining}
          className="h-9! rounded-lg! border-0! bg-sky-500! font-semibold! shadow-md! hover:bg-sky-600! hover:shadow-lg!"
        >
          Sign Up
        </Button>
      </Form.Item>
    </Form>
  );
}