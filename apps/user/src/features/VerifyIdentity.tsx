import { ArrowRight } from "lucide-react";
import { Button, Form, Input } from "antd";

export default function VerifyIdentity() {
  const handleFinish = () => {
    //api call
  };

  return (
    <div className="flex min-h-dvh w-full flex-col items-center bg-white pt-20">
      <Form
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        className="flex w-full gap-6 max-w-md flex-1 flex-col px-7 pt-14"
      >
        <div>
          <div className="flex justify-center">
            <img src="/padlock.svg" alt="" />
          </div>

          <div className="mt-5 text-center">
            <h1 className="text-xl font-bold text-slate-900">
              Verify Identity
            </h1>
            <p className="mt-2 px-2 text-sm leading-snug text-slate-500">
              Enter your email address or phone number to
              <br /> continue with registration.
            </p>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col mb-5">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input
              type="email"
              size="large"
              placeholder="e.g. example@gmail.com"
              className="rounded-xl"
            />
          </Form.Item>

          <div className="flex-1" />

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="rounded-md text-[15px] font-semibold"
            icon={<ArrowRight size={18} />}
            iconPlacement="end"
          >
            Continue
          </Button>
        </div>
      </Form>
    </div>
  );
}
