import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { paths } from "../../../config/paths";

export default function VerifyIdentity() {
  const navigate = useNavigate();

  const handleFinish = () => {
    // api call
    // only runs after validation passes:
    navigate(paths.register.getHref());
  };

  return (
    <div className="flex  w-full flex-col items-center bg-white max-md:pt-18">
      <Form
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        className="flex w-full max-w-md flex-1 flex-col gap-8 px-7"
      >
        <div>
          <div className="flex justify-center">
            <img src="/padlock.svg" alt="" loading="lazy" />
          </div>
          <div className="mt-1 text-center">
            <h1 className="text-xl font-bold text-slate-900">Verify Identity</h1>
            <p className="mt-2 px-2 text-sm leading-snug text-slate-500">
              Enter your email address or phone number to
              <br /> continue with registration.
            </p>
          </div>
        </div>

        <div className="mx-auto mb-5 flex justify-center w-full max-w-sm flex-1 flex-col">
          <Form.Item
            name="emailOrPhone"
            label="Email/Phone Number"
            rules={[
              { required: true, message: "Please enter your email or phone number" },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                  const isPhone = /^[0-9+\-\s]{7,15}$/.test(value);
                  return isEmail || isPhone
                    ? Promise.resolve()
                    : Promise.reject(new Error("Enter a valid email or phone number"));
                },
              },
            ]}
          >
            <Input size="large" placeholder="" className="rounded-xl" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="md:-mt[800px] rounded-md text-[15px] font-semibold"
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
