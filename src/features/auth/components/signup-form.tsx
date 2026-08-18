import { Form, Input, Button, message } from "antd";
import { getPasswordRules, getConfirmPasswordRules } from "../utils/validation";
import { useJoinOrganizationWithPasswordMutation } from "../api/auth-api-slice";
import { useNavigate } from "react-router-dom";
import { useTenant } from "@/lib/tenant";
import { paths } from "@/config/paths";

interface SignupFormValues {
  fullName: string;
  password: string;
  phoneNumber: string;
  confirmPassword: string;
}

const inputClass =
  "rounded-lg! border-slate-200! bg-slate-50! hover:border-slate-300! focus:border-sky-400! focus:bg-white! dark:border-slate-600! dark:bg-slate-700! dark:hover:border-slate-500! dark:focus:border-sky-400! dark:focus:bg-slate-800!";

export default function SignupForm({ inviteToken }: { inviteToken: string }) {
  const [form] = Form.useForm<SignupFormValues>();
  const [joinWithPassword, { isLoading }] = useJoinOrganizationWithPasswordMutation();
  const navigate = useNavigate();
  const { orgSlug } = useTenant();

  const handleSubmit = async (values: SignupFormValues) => {
    if (!inviteToken) {
      message.error("This invite link is missing or invalid. Please request a new invite.");
      return;
    }

    try {
      await joinWithPassword({
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        password: values.password,
        inviteToken,
      }).unwrap();

      message.success("Account created successfully.");
      navigate(paths.admin.dashboard.getHref(orgSlug), { replace: true });
    } catch (error) {
      const status = (error as { status?: number })?.status;

      if (status === 409) {
        message.error("This invitation has already been used, or an account already exists.");
      } else if (status === 403) {
        message.error("This invitation is invalid or has expired.");
      } else {
        message.error("Something went wrong. Please try again.");
      }
    }
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
        name="phoneNumber"
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
          loading={isLoading}
          className="h-11! rounded-lg! border-0! bg-sky-500! font-semibold! shadow-md! hover:bg-sky-600! hover:shadow-lg!"
        >
          Sign Up
        </Button>
      </Form.Item>
    </Form>
  );
}