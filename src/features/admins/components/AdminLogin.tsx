import { Form, Input, Button, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { paths } from "../../../config/paths";
import { ORG_SLUG } from "../../../lib/api";
import { useAdminLoginMutation, useMicrosoftLoginMutation } from "../api/auth-api";
import { getAuthToken } from "../utils/get-auth-token";
import { useMsalAuth } from "../../../lib/api/msal";
import { useAppDispatch } from "../../../lib/stores/hooks";
import { setAdminToken } from "../stores/auth-slice";

export default function AdminLogin() {
  const [form] = Form.useForm<{ email: string; password: string }>();
  const [isMicrosoftPopupOpen, setIsMicrosoftPopupOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const msal = useMsalAuth();
  const [adminLogin, { isLoading: isAdminLoggingIn }] = useAdminLoginMutation();
  const [microsoftLogin, { isLoading: isMicrosoftLoggingIn }] = useMicrosoftLoginMutation();

  const completeLogin = (token: string) => {
    if (!token) {
      message.error("Login succeeded but no token was returned.");
      return;
    }

    dispatch(setAdminToken(token));
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
    <div className="flex min-h-screen w-full flex-col bg-white md:flex-row">
      {/* Left panel */}
      <div className="relative flex w-full flex-col justify-between overflow-hidden bg-[#EFF7FB] from-sky-50 to-white px-4 py-8 sm:px-6 md:w-1/2 md:px-16 md:py-12">
        <div className="pointer-events-none absolute -top-10 right-0 left-0 h-24" />

        {/* Logo */}
        <div>
          <img
            src="/logo.svg"
            alt=""
            className="w-[125px] lg:mt-[00px] lg:-mb-[200px] lg:ml-[200px]"
          />
        </div>

        {/* Illustration */}
        <div className="flex flex-1 items-center justify-center py-10">
          <img src="loginimage.svg" alt="" className="w-[295px] lg:mt-[60px]" />
        </div>

        {/* Title + subtitle */}
        <div className="mb-10 text-center md:text-left lg:ml-[100px]">
          <h2 className="text-2xl font-bold text-slate-800 md:text-3xl lg:ml-15">
            Visitor Tracker
          </h2>
          <p className="mt-1 text-slate-400 lg:mr-[10px]">
            Ensure Secure Visitor Check-Ins and Approvals
          </p>
        </div>

        {/* Footer */}
        <div>
          <p className="mt-8 text-xs text-slate-400">© 2026 Zoracom. All Rights Reserved.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex w-full items-center justify-center bg-white px-4 py-8 sm:px-6 sm:py-10 md:w-1/2 md:px-8 md:py-16">
        <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200/60 sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900">Admin Login</h2>
          <p className="mt-1 mb-6 text-sm text-slate-400">
            Enter your credentials to manage the portal
          </p>

          <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
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
              rules={[{ required: true, message: "Please enter your password" }]}
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
                loading={isAdminLoggingIn}
                className="rounded-lg bg-sky-400! font-semibold hover:bg-sky-500!"
              >
                Login
              </Button>
            </Form.Item>

            <div className="relative flex items-center justify-center py-3">
              <div className="absolute right-0 left-0 border-t border-slate-200" />
              <span className="relative bg-white px-3 text-xs font-medium text-slate-400">or</span>
            </div>

            <Form.Item className="mb-2">
              <Button
                block
                size="large"
                icon={<img src="/microsoft.png" className="h-4 w-4" />}
                loading={isMicrosoftPopupOpen || isMicrosoftLoggingIn}
                onClick={handleMicrosoftLogin}
                className="rounded-lg font-semibold"
              >
                Sign in with Microsoft
              </Button>
            </Form.Item>

            <div className="pt-1 text-center">
              <Button type="link" className="px-0! text-sm text-sky-500! hover:text-sky-600!">
                Forgot Password?
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
