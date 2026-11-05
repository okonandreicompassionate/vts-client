import { paths } from "@/config/paths";
import { useOrganization } from "@/features/visitor-portal";
import {
  setVisitorSession,
  setVisitorVerified,
} from "@/features/visitor-portal/stores/visitor-auth-slice";
import { useAppDispatch } from "@/lib/stores/hooks";
import { getVisitActionErrorMessage } from "@/utils/visit-action-error";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useLookupVisitorEntryMutation,
  useRequestVisitorCodeMutation,
  useVerifyVisitorCodeMutation,
} from "../api/public-visits-api-slice";
import { useResendCooldown } from "../hooks/use-resend-cooldown";
import { readVisitRequestDraft } from "../utils/visit-request-draft";

import { usePopup } from "@/lib/contexts/popup/use-popup";
import type { VisitorEntry } from "../types/visitor-entry";
import { AppointmentChoiceCard } from "./appointment-choice-card";
import { ConfirmAppointmentModal } from "./confirm-appointment-modal";

type Step =
  | { name: "email" }
  | { name: "code"; email: string }
  | { name: "appointments"; email: string; entry: VisitorEntry };

export default function VerifyIdentity() {
  const { openModal } = usePopup();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const viewingAppointments = searchParams.get("intent") === "appointments";
  const { orgSlug, requireVisitorEmailVerification } = useOrganization();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<Step>({ name: "email" });
  const { remainingSeconds, startCooldown } = useResendCooldown();
  const resendSeconds = step.name === "code" ? remainingSeconds(step.email) : 0;

  const [lookupEntry, { isLoading: isLookingUp }] = useLookupVisitorEntryMutation();
  const [requestCode, { isLoading: isRequesting }] = useRequestVisitorCodeMutation();
  const [verifyCode, { isLoading: isVerifying }] = useVerifyVisitorCodeMutation();

  const sendCode = async (email: string) => {
    if (isRequesting) return;
    if (remainingSeconds(email) > 0) {
      setStep({ name: "code", email });
      return;
    }
    try {
      const result = await requestCode({ orgSlug, email }).unwrap();
      startCooldown(email, result.retryAfterSeconds);
      setStep({ name: "code", email });
      message.success("Check your email for a 6-digit code.");
    } catch (error) {
      message.error(
        getVisitActionErrorMessage(error, "We couldn't send a code. Please try again."),
      );
    }
  };

  const continueWithEntry = (entry: VisitorEntry) => {
    if (entry.appointments.length) setStep({ name: "appointments", email: entry.email, entry });
    else navigate(paths.register.getHref(orgSlug), { state: { entryEmail: entry.email } });
  };

  const handleFinish = async (values: { email?: string; code?: string }) => {
    if (step.name === "email") {
      const email = (values.email ?? "").trim().toLowerCase();
      if (viewingAppointments) {
        await sendCode(email);
        return;
      }
      try {
        continueWithEntry(await lookupEntry({ orgSlug, email }).unwrap());
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "data" in error &&
          error.data &&
          typeof error.data === "object" &&
          "code" in error.data &&
          error.data.code === "EMAIL_VERIFICATION_REQUIRED"
        )
          await sendCode(email);
        else
          message.error(
            getVisitActionErrorMessage(error, "Unable to look up your email. Please try again."),
          );
      }
      return;
    }

    if (step.name !== "code") return;
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

      if (viewingAppointments && response.exists) {
        navigate(paths.visitorAppointments.getHref(orgSlug), { replace: true });
      } else {
        continueWithEntry(await lookupEntry({ orgSlug, email: response.email }).unwrap());
      }
    } catch (error) {
      message.error(getVisitActionErrorMessage(error, "That code didn't work. Please try again."));
    }
  };

  if (step.name === "appointments") {
    return (
      <section className="w-full">
        <div className="flex items-center">
          {/* <div className="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-500 shadow-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
            <Calendar1Icon />
          </div> */}
          <div className="flex flex-col items-start">
            <h1 className="text-lg font-semibold text-slate-900 capitalize dark:text-zinc-100">
              Choose your appointment
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Available appointments for{" "} 
              <span className="font-semibold text-white">{step.email}</span>
            </p>
          </div>
        </div>

        <ul className="mt-8 mb-6 space-y-3">
          {step.entry.appointments.map((appointment) => (
            <li key={appointment.id}>
              <AppointmentChoiceCard
                appointment={appointment}
                onSelect={() =>
                  openModal(
                    <ConfirmAppointmentModal
                      appointment={appointment}
                      orgSlug={orgSlug}
                      email={step.email}
                    />,
                  )
                }
              />
            </li>
          ))}
        </ul>
        <Button
          type="primary"
          block
          onClick={() =>
            navigate(paths.register.getHref(orgSlug), { state: { entryEmail: step.email } })
          }
        >
          Request a new visit instead
        </Button>
        <Button
          type="link"
          onClick={() => setStep({ name: "email" })}
          className="mt-2 w-full px-0! text-white hover:text-white/80 dark:text-zinc-400 dark:hover:text-zinc-300"
        >
          Use a different email
        </Button>
      </section>
    );
  }

  return (
    <div className="flex w-full items-center justify-center">
      <Form
        key={step.name}
        initialValues={{ email: readVisitRequestDraft(orgSlug).email }}
        layout="vertical"
        onFinish={handleFinish}
        className="w-full"
      >
        <div className="md:flex md:flex-col md:items-center">
          <div className="flex justify-center">
            <img src="/padlock.svg" alt="" className="w-17" loading="lazy" />
          </div>

          <div className="mt-1 mb-10 text-center">
            <h1 className="text-lg font-bold text-slate-900 md:text-xl dark:text-zinc-100">
              {step.name === "email" ? "Enter your email" : "Verify your email"}
            </h1>

            <p className="mt-2 px-2 text-[13px] leading-snug text-slate-500 md:text-sm dark:text-zinc-400">
              {step.name === "email" ? (
                <>
                  Enter your email address
                  <br />
                  {requireVisitorEmailVerification || viewingAppointments
                    ? "to verify it and find your appointments."
                    : "to find your appointments or saved visitor details."}
                </>
              ) : (
                <>
                  Enter the 6-digit code we sent to
                  <br />
                  <span className="font-medium text-slate-700 dark:text-zinc-200">
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
              <Input type="email" autoComplete="email" />
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
                <Input.OTP
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  styles={{
                    root: {
                      display: "grid",
                      gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                      width: "100%",
                    },
                    input: { width: "100%", minWidth: 0, textAlign: "center" },
                  }}
                  length={6}
                />
              </Form.Item>
            </>
          )}
        </div>

        <div className="mt-4">
          <Button
            type="primary"
            htmlType="submit"
            block
            icon={<ArrowRightOutlined />}
            iconPlacement="end"
            loading={isRequesting || isVerifying || isLookingUp}
          >
            {step.name === "email" ? "Continue" : "Verify"}
          </Button>
          {step.name === "code" && (
            <div className="mt-2 flex w-full justify-between text-xs">
              <Button
                type="link"
                size="small"
                className="px-0! text-white hover:text-white/80 dark:text-zinc-400 dark:hover:text-zinc-300"
                onClick={() => setStep({ name: "email" })}
              >
                Use a different email
              </Button>
              <Button
                type="link"
                size="small"
                className="px-0! text-white hover:text-white/80 dark:text-zinc-400 dark:hover:text-zinc-300"
                loading={isRequesting}
                disabled={resendSeconds > 0 || isVerifying}
                onClick={() => void sendCode(step.email)}
              >
                {resendSeconds > 0 ? `Resend code in ${resendSeconds}s` : "Resend code"}
              </Button>
            </div>
          )}
        </div>
      </Form>
    </div>
  );
}
