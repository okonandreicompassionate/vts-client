import { Form, Input, Button } from "antd";
import { ArrowRight, Lock } from "lucide-react";


export default function VerifyIdentity() {
  const handleFinish = () => {
    // api call
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="relative w-full max-w-90 h-180">
        <Form
          layout="vertical"
          requiredMark={false}
          onFinish={handleFinish}
          className="flex h-full flex-col"
        >
          <div className="flex-1 flex flex-col px-7 pt-10 overflow-y-auto">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center">
                <div className="relative">
                  <Lock size={26} className="text-sky-500" strokeWidth={2.2} />
                  <div className="absolute -bottom-0.5 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-sky-50" />
                </div>
              </div>
            </div>

            <div className="text-center mt-5">
              <h1 className="text-slate-900 text-xl font-bold">Verify Identity</h1>
              <p className="text-slate-500 text-[13px] leading-snug mt-2 px-2">
                Enter your email address or phone number to continue with registration.
              </p>
            </div>

            <Form.Item
              name="email"
              label="Email"
              className="mt-8"
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
          </div>

          <div className="px-6 pb-8 pt-4">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="flex items-center justify-center gap-2 rounded-xl font-semibold"
            >
              Continue
              <ArrowRight size={18} />
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}