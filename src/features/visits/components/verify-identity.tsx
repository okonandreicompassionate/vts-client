import { useState } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { paths } from "@/config/paths";
import { useOrganization } from "@/features/organizations";
import { useAppDispatch } from "@/lib/stores/hooks";
import {
  setVisitorSession,
  setVisitorVerified,
} from "../../auth/stores/visitor-auth-slice";
import {
  useRequestVisitorCodeMutation,
  useVerifyVisitorCodeMutation,
} from "../api/public-visits-api-slice";
import { getVisitActionErrorMessage } from "../utils/visits";

type Step = { name: "email" } | { name: "code"; email: string };

export default function VerifyIdentity() {
  const navigate = useNavigate();
  const { orgSlug } = useOrganization();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<Step>({ name: "email" });

  const [requestCode, { isLoading: isRequesting }] = useRequestVisitorCodeMutation();
  const [verifyCode, { isLoading: isVerifying }] = useVerifyVisitorCodeMutation();

  const sendCode = async (email: string) => {
    try {
      await requestCode({ orgSlug, email }).unwrap();
      setStep({ name: "code", email });
      message.success("Check your email for a 6-digit code.");
    } catch (error) {
      message.error(
        getVisitActionErrorMessage(error, "We couldn't send a code. Please try again."),
      );
    }
  };

  const handleFinish = async (values: { email?: string; code?: string }) => {
    if (step.name === "email") {
      await sendCode((values.email ?? "").trim().toLowerCase());
      return;
    }

    try {
      const response = await verifyCode({
        orgSlug,
        email: step.email,
        code: (values.code ?? "").trim(),
      }).unwrap();

      if (response.exists && response.visitor) {
        const { visitor } = response;

        dispatch(
          setVisitorSession({
            visitorId: visitor.id,
            fullName: `${visitor.firstName} ${visitor.lastName}`.trim(),
            email: visitor.email,
            phoneNumber: visitor.phone,
          }),
        );
      } else {
        dispatch(setVisitorVerified({ email: response.email }));
      }

      navigate(paths.register.getHref(orgSlug), { replace: true });
    } catch (error) {
      message.error(
        getVisitActionErrorMessage(error, "That code didn't work. Please try again."),
      );
    }
  };

  return (
    <div className="flex w-full justify-center md:min-h-[calc(100dvh-8rem)] md:items-center">
      <Form
        key={step.name}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        className="flex min-h-[calc(100dvh-4rem)] w-full max-w-md flex-col px-7 pt-4 pb-6 md:min-h-0 md:pt-0 md:pb-0 dark:bg-slate-900 dark:shadow-black/20"
      >
        <div className="md:flex md:flex-col md:items-center">
          <div className="flex justify-center">
            <img
              src="/padlock.svg"
              alt=""
              className="w-17"
              loading="lazy"
            />
          </div>

          <div className="mt-1 text-center">
            <h1 className="text-lg font-bold text-slate-900 md:text-xl dark:text-slate-100">
              Verify Identity
            </h1>

            <p className="mt-2 px-2 text-[13px] leading-snug text-slate-500 md:text-sm dark:text-slate-400">
              {step.name === "email" ? (
                <>
                  Enter your email address
                  <br />
                  and we'll send you a code.
                </>
              ) : (
                <>
                  Enter the 6-digit code we sent to
                  <br />
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {step.email}
                  </span>
                </>
              )}
            </p>
          </div>

          {step.name === "email" ? (
            <Form.Item
              className="mt-5 w-full"
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email address" },
              ]}
            >
              <Input
                size="large"
                type="email"
                autoComplete="email"
                className="rounded-xl dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              />
            </Form.Item>
          ) : (
            <>
              <Form.Item
                className="mt-5 w-full"
                name="code"
                label="Verification code"
                rules={[
                  { required: true, message: "Please enter the code" },
                  { pattern: /^\d{6}$/, message: "The code is 6 digits" },
                ]}
              >
                <Input
                  size="large"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  className="rounded-xl text-center tracking-[0.5em] dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                />
              </Form.Item>

              <div className="-mt-2 flex w-full justify-between text-xs">
                <Button
                  type="link"
                  size="small"
                  className="px-0!"
                  onClick={() => setStep({ name: "email" })}
                >
                  Use a different email
                </Button>
                <Button
                  type="link"
                  size="small"
                  className="px-0!"
                  loading={isRequesting}
                  onClick={() => void sendCode(step.email)}
                >
                  Resend code
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="fixed inset-x-0 bottom-0 z-20 sm:pt-0 bg-white px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+16px)] md:static md:border-0 md:bg-transparent md:px-0 md:pb-0 dark:border-slate-700 dark:bg-slate-900 sm:mt-auto">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="rounded-lg text-[13px] font-medium"
            icon={<ArrowRightOutlined />}
            iconPlacement="end"
            loading={step.name === "email" ? isRequesting : isVerifying}
          >
            {step.name === "email" ? "Send code" : "Verify"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
