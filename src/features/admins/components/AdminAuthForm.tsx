import { Form, Input, Button, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginLeft from "./layout/LoginLeft";

import { paths } from "../../../config/paths";
import { ORG_SLUG } from "../../../lib/api";
import { useAdminLoginMutation, useMicrosoftLoginMutation } from "../api/admin-api";
import { getAuthToken } from "../utils/get-auth-token";
import { useMsalAuth } from "../../../lib/api/msal";
import { useAppDispatch } from "../../../lib/stores/hooks";
import { setAdminToken } from "../stores/auth-slice";

type AuthMode = "login" | "signup";

interface LoginFormValues {
  email: string;
  password: string;
}

interface SignupFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function AdminAuthForm() {
  const [form] = Form.useForm<LoginFormValues & SignupFormValues>();
  const [mode, setMode] = useState<AuthMode>("login");
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

  const handleModeChange = () => {
    form.resetFields();
    setMode(mode === "login" ? "signup" : "login");
  };

  const handleLoginSubmit = async (values: LoginFormValues) => {
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

  const handleSignupSubmit = async (values: SignupFormValues) => {
    // TODO: wire up signup API call here once available
    console.log("Signup values:", values);
    message.info("Signup functionality coming soon. Please contact your administrator.");
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
    <div className="flex h-full min-h-screen w-full flex-col justify-center bg-white md:flex-row">
      {/* Left panel */}
      <LoginLeft />

      
        <header className="sm:hidden flex flex-col items-center justify-center gap-4 px-4 py-8 sm:px-6 md:px-16 md:py-12">
          <img src="/logo.svg" alt="" className="w-32 object-cover lg:mt-0 lg:-mb-40 lg:ml-40" />
          <h2 className="text-2xl font-bold text-slate-800 md:text-3xl lg:ml-3">Visitor Tracker</h2>
        </header>
      

      {/* Right panel */}
      <div className="flex h-full w-full items-center justify-center bg-slate-50 px-4 py-8 sm:px-6 sm:py-10 md:w-1/2 md:px-8 md:py-16">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/30 sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              {mode === "login" ? "Admin Login" : "Create Admin Account"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {mode === "login"
                ? "Enter your credentials to manage the portal"
                : "Fill in your details to get started"}
            </p>
          </div>

          {/* Forms */}
          <Form
            form={form}
            layout="vertical"
            onFinish={mode === "login" ? handleLoginSubmit : handleSignupSubmit}
            requiredMark={false}
            className="space-y-1"
          >
            {/* Signup only fields */}
            {mode === "signup" && (
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
            )}

            {/* Email - for both */}
            <Form.Item
              label={<span className="text-sm font-semibold text-slate-700">Email Address</span>}
              name="email"
              rules={[
                { required: true, message: "Please enter your email address" },
                { type: "email", message: "Please enter a valid email address" },
              ]}
            >
              <Input
                placeholder="admin@zoracom.com"
                size="large"
                className="rounded-lg! border-slate-200! bg-slate-50! hover:border-slate-300! focus:border-sky-400! focus:bg-white!"
              />
            </Form.Item>

            {/* Password - for both */}
            <Form.Item
              label={<span className="text-sm font-semibold text-slate-700">Password</span>}
              name="password"
              rules={[
                { required: true, message: "Please enter a password" },
                ...(mode === "signup"
                  ? [{ min: 8, message: "Password must be at least 8 characters" }]
                  : []),
              ]}
              hasFeedback={mode === "signup"}
            >
              <Input.Password
                placeholder="••••••••••"
                size="large"
                className="rounded-lg! border-slate-200! bg-slate-50! hover:border-slate-300! focus:border-sky-400! focus:bg-white!"
              />
            </Form.Item>

            {/* Confirm Password - signup only */}
            {mode === "signup" && (
              <Form.Item
                label={
                  <span className="text-sm font-semibold text-slate-700">Confirm Password</span>
                }
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
                  className="rounded-lg! border-slate-200! bg-slate-50! hover:border-slate-300! focus:border-sky-400! focus:bg-white!"
                />
              </Form.Item>
            )}

            {/* Submit Button */}
            <Form.Item className="mb-3 pt-2">
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={isAdminLoggingIn}
                className="h-11! rounded-lg! border-0! bg-sky-500! font-semibold! shadow-md! hover:bg-sky-600! hover:shadow-lg!"
              >
                {mode === "login" ? "Login" : "Sign Up"}
              </Button>
            </Form.Item>

            {/* Microsoft Login - only for login mode */}
            {mode === "login" && (
              <>
                <div className="relative flex items-center justify-center py-3">
                  <div className="absolute right-0 left-0 border-t border-slate-200" />
                  <span className="relative bg-white px-3 text-xs font-medium text-slate-400">
                    or
                  </span>
                </div>

                <Form.Item className="mb-3">
                  <Button
                    block
                    size="large"
                    icon={<img src="/microsoft.png" className="h-4 w-4" />}
                    loading={isMicrosoftPopupOpen || isMicrosoftLoggingIn}
                    onClick={handleMicrosoftLogin}
                    className="h-11! rounded-lg! border-slate-200! font-semibold! hover:border-slate-300! hover:bg-slate-50!"
                  >
                    Sign in with Microsoft
                  </Button>
                </Form.Item>

                <div className="text-center">
                  <Button
                    type="link"
                    className="px-0! text-sm! font-medium! text-sky-500! hover:text-sky-600!"
                  >
                    Forgot Password?
                  </Button>
                </div>
              </>
            )}
          </Form>

          {/* Mode Toggle Message */}
          <div className="mt-6 text-center">
            {mode === "login" ? (
              <span className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Button
                  type="link"
                  className="px-1! text-sm! font-semibold! text-sky-500! hover:text-sky-600!"
                  onClick={handleModeChange}
                >
                  Sign Up
                </Button>
              </span>
            ) : (
              <span className="text-sm text-slate-500">
                Already have an account?{" "}
                <Button
                  type="link"
                  className="px-1! text-sm! font-semibold! text-sky-500! hover:text-sky-600!"
                  onClick={handleModeChange}
                >
                  Login
                </Button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
