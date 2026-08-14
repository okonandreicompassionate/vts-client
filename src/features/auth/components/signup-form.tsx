import { Form, Input, Button, message } from "antd";
import { getPasswordRules, getConfirmPasswordRules } from "../utils/validation";

interface SignupFormValues {
  fullName: string;
  password: string;
  phoneNumber: string;
  confirmPassword: string;
}

const inputClass =
  "rounded-lg! border-slate-200! bg-slate-50! hover:border-slate-300! focus:border-sky-400! focus:bg-white! dark:border-slate-600! dark:bg-slate-700! dark:hover:border-slate-500! dark:focus:border-sky-400! dark:focus:bg-slate-800!";

export default function SignupForm() {
  const [form] = Form.useForm<SignupFormValues>();

  const handleSubmit = async (values: SignupFormValues) => {
    // TODO: wire up signup API call here once available
    console.log("Signup values:", values);
    message.info("Signup functionality coming soon. Please contact your administrator.");
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
      <Form.Item
        label={<span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Full Name</span>}
        name="fullName"
        rules={[{ required: true, message: "Please enter your full name" }]}
        className="mb-4!"
      >
        <Input size="small" className={inputClass} />
      </Form.Item>

   <Form.Item
        label={<span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Phone Number</span>}
        name="phoneNo"
        rules={[{ required: true, message: "Please enter your phone number" }]}
        className="mb-4!"
      >
        <Input size="small" className={inputClass} />
      </Form.Item>

      <Form.Item
        label={<span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Password</span>}
        name="password"
        rules={getPasswordRules({ minLength: 8 })}
        hasFeedback
        className="mb-4!"
      >
        <Input.Password placeholder="••••••••••" size="small" className={inputClass} />
      </Form.Item>

      <Form.Item
        label={<span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Confirm Password</span>}
        name="confirmPassword"
        dependencies={["password"]}
        hasFeedback
        rules={getConfirmPasswordRules("password")}
        className="mb-5!"
      >
        <Input.Password placeholder="••••••••••" size="small" className={inputClass} />
      </Form.Item>

      <Form.Item className="mb-0!">
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