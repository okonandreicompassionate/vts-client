import { ArrowRight } from "lucide-react";
import { Button, Form, Input } from "antd";

export default function VerifyIdentity() {
  const handleFinish = () => {
    //api call
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <Form
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        className="mx-auto flex w-full max-w-md flex-1 flex-col px-7 pb-8 pt-14"
      >
        <div className="flex justify-center">
           <div className="flex justify-center">
            <img src="/padlock.svg" alt="" />
          </div>
        </div>

        <div className="mt-5 text-center">
          <h1 className="text-xl font-bold text-slate-900">Verify Identity</h1>
          <p className="mt-2 px-2 text-xs leading-snug text-slate-500">
            Enter your email address or phone number to
            <br /> continue with registration.
          </p>
        </div>

        <Form.Item
          name="email"
          label="Email"
          className="mx-auto mt-8 w-full max-w-xs"
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
          className="mx-auto w-full max-w-xs rounded-xl text-[15px] font-semibold"
          icon={<ArrowRight size={18} />}
          iconPlacement="end"
        >
          Get Started
        </Button>
      </Form>
    </div>
  );
}
