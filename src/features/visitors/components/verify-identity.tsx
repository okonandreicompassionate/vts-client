import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { paths } from "../../../config/paths";
import { useTenant } from "../../../lib/tenant";
import { ThemeToggle } from "../../../components/theme-toggle";
import { useVerifyVisitIdentityMutation } from "../api/visit-api-slice";

export default function VerifyIdentity() {
  const navigate = useNavigate();
  const { orgSlug } = useTenant();
  const [verifyVisitIdentity] = useVerifyVisitIdentityMutation();

  const handleFinish = async (value: { email: string }) => {
    try {
      const response = await verifyVisitIdentity(value).unwrap();

      window.localStorage.setItem(
        "visitorId",
        JSON.stringify({
          visitorId: response.visitor.id,
          name: response.visitor.fullName,
          email: response.visitor.email,
          phoneNo: response.visitor.phoneNumber,
        }),
      );

      window.localStorage.setItem(
        "visitorSession",
        JSON.stringify({
          visitorId: response.visitor.id,
          accessToken: response.accessToken,
        }),
      );

      window.localStorage.setItem("visitorVerified", "true");

      navigate(paths.register.getHref(orgSlug));
    } catch {
      message.error("We couldn't verify your identity. Please try again.");
    }
  };

  return (
    <div className="relative md:flex md:items-center  min-h-screen bg-white dark:bg-slate-900">
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>

      <Form
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        className="mx-auto flex min-h-screen w-full max-w-md flex-col px-7 pt-18 md:pt-0 pb-6 md:min-h-0 md:pb-0 dark:bg-slate-900 dark:shadow-black/20"
      >
        <div className="md:flex md:flex-col md:items-center lg:items-center">
          <div className="flex justify-center">
            <img src="/padlock.svg" alt="" loading="lazy" />
          </div>

          <div className="mt-1 text-center">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Verify Identity
            </h1>

            <p className="mt-2 px-2 text-sm leading-snug text-slate-500 dark:text-slate-400">
              Enter your email address
              <br />
              to continue with registration.
            </p>
          </div>

          <Form.Item
            className="mt-8 w-full"
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();

                  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

                  return isEmail
                    ? Promise.resolve()
                    : Promise.reject(new Error("Enter a valid email address"));
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

        <div className="mt-auto pb-4 md:mt-10 md:pb-0">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            icon={<ArrowRightOutlined />}
            iconPlacement="end"
          >
            Continue
          </Button>
        </div>
      </Form>
    </div>
  );
}
