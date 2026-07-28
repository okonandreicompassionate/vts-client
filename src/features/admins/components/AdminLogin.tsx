import { WindowsOutlined } from "@ant-design/icons";
import { Form, Input, Button, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { paths } from "../../../config/paths";
import {
  getAuthToken,
  ORG_SLUG,
  useAdminLoginMutation,
  useMicrosoftLoginMutation,
} from "../../../lib/api";
import { useMsalAuth } from "../../../lib/api/msal";

export default function AdminLogin() {
  const [form] = Form.useForm<{ email: string; password: string }>();
  const [isMicrosoftPopupOpen, setIsMicrosoftPopupOpen] = useState(false);
  const navigate = useNavigate();
  const msal = useMsalAuth();
  const [adminLogin, { isLoading: isAdminLoggingIn }] = useAdminLoginMutation();
  const [microsoftLogin, { isLoading: isMicrosoftLoggingIn }] = useMicrosoftLoginMutation();

  const completeLogin = (token: string) => {
    if (!token) {
      message.error("Login succeeded but no token was returned.");
      return;
    }

    window.localStorage.setItem("token", token);
    navigate(paths.admin.dashboard.getHref());
  };

  const handleFinish = async (values: { email: string; password: string }) => {
    try {
      const response = await adminLogin({
        orgSlug: ORG_SLUG,
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

  const handleMicrosoftLogin = async () => {
    try {
      setIsMicrosoftPopupOpen(true);
      const msalResult = await msal.login();
      const response = await microsoftLogin({ accessToken: msalResult.accessToken }).unwrap();

      completeLogin(getAuthToken(response));
      message.success("Microsoft login successful");
    } catch (error) {
      console.error(error);
      message.error("Unable to login with Microsoft, please try again");
    } finally {
      setIsMicrosoftPopupOpen(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Left panel */}
      <div className="relative w-full md:w-1/2 bg-[#EFF7FB] from-sky-50 to-white flex flex-col justify-between px-4 py-8 sm:px-6 md:px-16 md:py-12 overflow-hidden">
        <div className="pointer-events-none absolute -top-10 left-0 right-0 h-24 " />

        {/* Logo */}
        <div>
          <img src="/logo.svg" alt="" className="w-[125px] lg:-mb-[200px] lg:mt-[00px] lg:ml-[200px]" />
        </div>

        {/* Illustration */}
        <div className="flex-1 flex items-center justify-center py-10">
          <img src="loginimage.svg" alt="" className="w-[295px] lg:mt-[60px]" />
        </div>

        {/* Title + subtitle */}
        <div className="text-center md:text-left mb-10 lg:ml-[100px]">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 lg:ml-15">Visitor Tracker</h2>
          <p className="text-slate-400 mt-1 lg:mr-[10px]">Ensure Secure Visitor Check-Ins and Approvals</p>
        </div>

        {/* Footer */}
        <div>
          <p className="text-xs text-slate-400 mt-8">© 2026 Zoracom. All Rights Reserved.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-16 bg-white">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 p-5 sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900">Admin Login</h2>
          <p className="text-sm text-slate-400 mt-1 mb-6">Enter your credentials to manage the portal</p>

          <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
            <Form.Item
              label={<span className="text-sm font-semibold text-slate-800">Email Address</span>}
              name="email"
              rules={[
                { required: true, message: "Please enter your email address" },
                { type: "email", message: "Please enter a valid email address" },
              ]}
            >
              <Input placeholder="admin@zoracom.com" size="large" className="rounded-lg bg-slate-100!" />
            </Form.Item>

            <Form.Item
              label={<span className="text-sm font-semibold text-slate-800">Password</span>}
              name="password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password placeholder="••••••••••" size="large" className="rounded-lg bg-slate-100!" />
            </Form.Item>

            <Form.Item className="mb-2">
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={isAdminLoggingIn}
                className="bg-sky-400! hover:bg-sky-500! font-semibold rounded-lg"
              >
                Login
              </Button>
            </Form.Item>

            <div className="relative flex items-center justify-center py-3">
              <div className="absolute left-0 right-0 border-t border-slate-200" />
              <span className="relative bg-white px-3 text-xs font-medium text-slate-400">or</span>
            </div>

            <Form.Item className="mb-2">
              <Button
                block
                size="large"
                icon={<img src="/microsoft.png" className="w-4 h-4" />}
                loading={isMicrosoftPopupOpen || isMicrosoftLoggingIn}
                onClick={handleMicrosoftLogin}
                className="font-semibold rounded-lg"
              >
                Sign in with Microsoft
              </Button>
            </Form.Item>

            <div className="text-center pt-1">
              <Button type="link" className="text-sky-500! hover:text-sky-600! text-sm px-0!">
                Forgot Password?
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
