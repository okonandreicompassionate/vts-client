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
import { useVerifyVisitIdentityMutation } from "../api/public-visits-api-slice";

export default function VerifyIdentity() {
  const navigate = useNavigate();
  const { orgSlug } = useOrganization();
  const dispatch = useAppDispatch();

  const [verifyVisitIdentity, {isLoading: isVerifying}] =
    useVerifyVisitIdentityMutation();

  const handleFinish = async (value: { email: string }) => {
    try {
      const email = value.email.trim().toLowerCase();

      const response = await verifyVisitIdentity({
        email,
      }).unwrap();

      if (response.exists && response.visitor) {
        dispatch(
          setVisitorSession({
            visitorId: response.visitor.id,
            fullName: response.visitor.fullName,
            email: response.visitor.email,
            phoneNumber: response.visitor.phoneNumber,
          }),
        );

        navigate(paths.register.getHref(orgSlug), {
          replace: true,
        });

        return;
      }

      dispatch(
        setVisitorVerified({
          email,
        }),
      );

      navigate(paths.register.getHref(orgSlug), {
        replace: true,
      });
    } catch (error) {
      console.error("Verify identity failed:", error);

      message.error(
        "We couldn't verify your identity. Please try again.",
      );
    }
  };

  return (
    <div className="flex w-full justify-center md:min-h-[calc(100dvh-8rem)] md:items-center">
      <Form
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
              Enter your email address
              <br />
              to continue with registration.
            </p>
          </div>

          <Form.Item
            className="mt-5 w-full"
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Please enter your email",
              },
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.resolve();
                  }

                  const isEmail =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

                  return isEmail
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Enter a valid email address"),
                      );
                },
              },
            ]}
          >
            <Input
              size="large"
              className="rounded-xl dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
          </Form.Item>
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
              loading={isVerifying}
            >
             Verify Identity
            </Button>
          </div>
      </Form>
    </div>
  );
}