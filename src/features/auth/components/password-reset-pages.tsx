import { useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Alert, Button, Form, Input, message } from "antd";

import { paths } from "@/config/paths";
import { getApiErrorMessage } from "@/utils/api-error";
import { useForgotPasswordMutation, useResetPasswordMutation } from "../api/auth-api-slice";
import { emailRules, getConfirmPasswordRules, getPasswordRules } from "../utils/validation";
import AuthLayout from "./layout/auth-layout";

// The server's minimum (ResetPasswordDto).
const MIN_PASSWORD_LENGTH = 8;

function ResetShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <AuthLayout>
      <div className="mx-auto w-full">
        <div className="mb-6 flex flex-col gap-1.5">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">{title}</h2>
          <p className="text-sm leading-relaxed text-slate-500 dark:text-zinc-400">{subtitle}</p>
        </div>

        {children}

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-zinc-400">
          <Link to={paths.admin.login.getHref()} className="font-semibold text-sky-500 hover:text-sky-600">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

/** /forgot-password: asks for an email and sends a reset link. */
export function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [sentTo, setSentTo] = useState<string | null>(null);

  const handleSubmit = async ({ email }: { email: string }) => {
    try {
      await forgotPassword({ email: email.trim() }).unwrap();
      setSentTo(email.trim());
    } catch (error) {
      message.error(getApiErrorMessage(error, "The reset link could not be sent. Please try again."));
    }
  };

  return (
    <ResetShell
      title="Forgot your password?"
      subtitle="Enter the email you sign in with and we'll send you a link to choose a new one."
    >
      {sentTo ? (
        <Alert
          type="success"
          showIcon
          message="Check your email"
          description={`If an account uses ${sentTo}, a reset link is on its way. It works once and expires in 30 minutes.`}
        />
      ) : (
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Email Address" name="email" rules={emailRules}>
            <Input type="email" placeholder="you@company.com" autoComplete="email" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={isLoading}>
            Send reset link
          </Button>
        </Form>
      )}
    </ResetShell>
  );
}

/** /reset-password?token=…: the page the emailed link opens. */
export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [done, setDone] = useState(false);

  const handleSubmit = async ({ password }: { password: string }) => {
    if (!token) return;

    try {
      await resetPassword({ token, password }).unwrap();
      setDone(true);
    } catch (error) {
      message.error(getApiErrorMessage(error, "Your password could not be reset. Please try again."));
    }
  };

  if (!token) {
    return (
      <ResetShell title="Reset link missing" subtitle="This page needs the link from your reset email.">
        <Link to={paths.admin.forgotPassword.getHref()}>
          <Button type="primary" block>
            Request a new link
          </Button>
        </Link>
      </ResetShell>
    );
  }

  return (
    <ResetShell title="Choose a new password" subtitle="You'll be signed out on every device after the reset.">
      {done ? (
        <div className="flex flex-col gap-4">
          <Alert type="success" showIcon message="Your password has been reset. You can now sign in." />
          <Link to={paths.admin.login.getHref()}>
            <Button type="primary" block>
              Sign in
            </Button>
          </Link>
        </div>
      ) : (
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="New Password"
            name="password"
            rules={getPasswordRules({ required: true, minLength: MIN_PASSWORD_LENGTH })}
          >
            <Input.Password placeholder="••••••••••" autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={getConfirmPasswordRules("password")}
          >
            <Input.Password placeholder="••••••••••" autoComplete="new-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={isLoading}>
            Reset password
          </Button>
        </Form>
      )}
    </ResetShell>
  );
}
