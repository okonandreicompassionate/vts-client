import { Form, Input, Button, message } from "antd";
import { emailRules, getPasswordRules, getConfirmPasswordRules } from "../utils/validation";

interface SignupFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupForm() {
  const [form] = Form.useForm<SignupFormValues>();

  const handleSubmit = async (values: SignupFormValues) => {
    // TODO: wire up signup API call here once available
    console.log("Signup values:", values);
    message.info("Signup functionality coming soon. Please contact your administrator.");
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      requiredMark={false}
      className="space-y-1"
    >
      {/* Full Name */}
      <Form.Item
        label={<span className="text-sm font-semibold text-slate-700">Full Name</span>}
        name="fullName"
        rules={[{ required: true, message: "Please enter your full name" }]}
      >
        <Input
          placeholder="John Doe"
          size="large"
          className="rounded-lg! border-slate-200! bg-slate-50! hover:border-slate-300! focus:border-sky-400! focus:bg-white!"
        />
      </Form.Item>

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
        rules={getPasswordRules({ minLength: 8 })}
        hasFeedback
      >
        <Input.Password
          placeholder="••••••••••"
          size="large"
          className="rounded-lg! border-slate-200! bg-slate-50! hover:border-slate-300! focus:border-sky-400! focus:bg-white!"
        />
      </Form.Item>

      {/* Confirm Password */}
      <Form.Item
        label={<span className="text-sm font-semibold text-slate-700">Confirm Password</span>}
        name="confirmPassword"
        dependencies={["password"]}
        hasFeedback
        rules={getConfirmPasswordRules("password")}
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
          className="h-11! rounded-lg! border-0! bg-sky-500! font-semibold! shadow-md! hover:bg-sky-600! hover:shadow-lg!"
        >
          Sign Up
        </Button>
      </Form.Item>
    </Form>
  );
}