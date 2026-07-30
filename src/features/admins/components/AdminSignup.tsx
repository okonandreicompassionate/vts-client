import { Form, Input, Button, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginLeft from "./layout/LoginLeft";

import { paths } from "../../../config/paths";

export default function AdminSignup() {
  const [form] = Form.useForm<{
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async (values: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setIsSigningUp(true);
    try {
      // TODO: wire up signup API call here once available
      console.log("Signup values:", values);

      message.success("Account created successfully");
      navigate(paths.admin.login.getHref());
    } catch (error) {
      console.error(error);
      message.error("Unable to sign up, please try again.");
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white md:flex-row">
      {/* Left panel */}
      <LoginLeft />
      {/* Right panel */}
      <div className="flex w-full items-center justify-center bg-white px-4 py-8 sm:px-6 sm:py-10 md:w-1/2 md:px-8 md:py-16">
        <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200/60 sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900">Create Admin Account</h2>
          <p className="mt-1 mb-6 text-sm text-slate-400">
            Fill in your details to get started
          </p>

          <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
            <Form.Item
              label={<span className="text-sm font-semibold text-slate-800">Full Name</span>}
              name="fullName"
              rules={[{ required: true, message: "Please enter your full name" }]}
            >
              <Input
                placeholder="John Doe"
                size="large"
                className="rounded-lg bg-slate-100!"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-sm font-semibold text-slate-800">Email Address</span>}
              name="email"
              rules={[
                { required: true, message: "Please enter your email address" },
                { type: "email", message: "Please enter a valid email address" },
              ]}
            >
              <Input
                placeholder="admin@zoracom.com"
                size="large"
                className="rounded-lg bg-slate-100!"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-sm font-semibold text-slate-800">Password</span>}
              name="password"
              rules={[
                { required: true, message: "Please enter a password" },
                { min: 8, message: "Password must be at least 8 characters" },
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder="••••••••••"
                size="large"
                className="rounded-lg bg-slate-100!"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-sm font-semibold text-slate-800">Confirm Password</span>}
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="••••••••••"
                size="large"
                className="rounded-lg bg-slate-100!"
              />
            </Form.Item>

            <Form.Item className="mb-2">
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={isSigningUp}
                className="rounded-lg bg-sky-400! font-semibold hover:bg-sky-500!"
              >
                Sign Up
              </Button>
            </Form.Item>

            <div className="pt-1 text-center">
              <span className="text-sm text-slate-400">Already have an account? </span>
              <Button
                type="link"
                className="px-0! text-sm text-sky-500! hover:text-sky-600!"
                onClick={() => navigate(paths.admin.login.getHref())}
              >
                Log in
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}