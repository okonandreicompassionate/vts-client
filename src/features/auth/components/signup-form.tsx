import { Form, Input, Button, message } from "antd";

import {
  getPasswordRules,
  getConfirmPasswordRules,
} from "../utils/validation";
import { useJoinOrganizationWithPasswordMutation } from "../api/auth-api-slice";
import { useCompleteLogin } from "../hooks/use-complete-login";
import { getApiErrorMessage } from "@/utils/api-error";
import { fullNameRules, splitFullName } from "@/utils/full-name";

interface SignupFormValues {
  fullName: string;
  password: string;
  phoneNumber: string;
  confirmPassword: string;
}

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
        ...splitFullName(values.fullName),
        phone: values.phoneNumber.trim(),
        password: values.password,
        inviteToken,
      }).unwrap();

      message.success("Account created successfully.");

      completeLogin(result);
    } catch (error) {
      message.error(getApiErrorMessage(error, "Unable to complete account setup. Please try again."));
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        label="Full Name"
        name="fullName"
        rules={fullNameRules}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Phone Number"
        name="phoneNumber"
        rules={[
          {
            required: true,
            message: "Please enter your phone number",
          },
        ]}
        className="mb-4!"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={getPasswordRules({ minLength: 8 })}
        hasFeedback
        className="mb-4!"
      >
        <Input.Password
          placeholder="••••••••••"
        />
      </Form.Item>

      <Form.Item
        label="Confirm Password"
        name="confirmPassword"
        dependencies={["password"]}
        hasFeedback
        rules={getConfirmPasswordRules("password")}
        className="mb-5!"
      >
        <Input.Password
          placeholder="••••••••••"
        />
      </Form.Item>

      <Form.Item className="mb-0!">
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={isJoining}
          disabled={isJoining}
        >
          Sign Up
        </Button>
      </Form.Item>
    </Form>
  );
}