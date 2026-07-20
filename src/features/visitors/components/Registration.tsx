import { Button, Form, Input } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { usePopup } from "../../../hooks/usePopup";
import RegistrationModal from "../components/modals/RegistrationModal";
import RegistrationSuccessModal from "../components/modals/RegistrationSuccessModal";
import type { RegistrationValues } from "../types/registration-values";

export default function Registration() {
  const [form] = Form.useForm<RegistrationValues>();
  const { openModal } = usePopup();

  const handleFinish = async (values: RegistrationValues) => {
    openModal(
      <RegistrationModal
        onSubmit={async () => {
          // todo: send registration to API
          // e.g await api.register(values);
          console.log("submitting registration:", values);
          form.resetFields();
          openModal(<RegistrationSuccessModal />);
        }}
      />,
    );
  };

  return (
    <div className="flex w-full flex-col bg-white">
      <header className="jusify-between flex items-center border-b border-slate-200 px-5 py-4">
        <h1 className="text-lg font-bold text-slate-900">Registration</h1>
        {/* <Button
          type="text"
          aria-label="Notifications"
          icon={<BellOutlined className="text-lg" />}
          className="text-slate-500! hover:text-slate-700!"
        /> */}
      </header>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        className="flex flex-1 flex-col px-5 pt-6 pb-4"
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input size="large" placeholder="" className="rounded-xl" />
        </Form.Item>

        <Form.Item
          name="purposeOfVisit"
          label="Purpose of Visit"
          rules={[{ required: true, message: "Please select a purpose" }]}
        >
          {/* <Select
            size="large"
            placeholder="Select a purpose"
            className="rounded-xl"
            options={[
              { value: "enquiry", label: "Enquiry" },
              { value: "meeting", label: "Meeting" },
              { value: "delivery", label: "Delivery" },
              { value: "interview", label: "Interview" },
              { value: "other", label: "Other" },
            ]}
          /> */}
          <Input size="large" placeholder="" className="rounded-xl" />
        </Form.Item>

        <Form.Item
          name="hostName"
          label="Host Name"
          rules={[{ required: true, message: "Please enter the host name" }]}
        >
          <Input size="large" className="rounded-xl" />
        </Form.Item>


        <Form.Item
          name="phoneNo"
          label="Phone Number"
          rules={[
            { required: true, message: "Please enter your phone number" },
            { pattern: /^[0-9+\-\s]{7,15}$/, message: "Please enter a valid phone number" },
          ]}
        >
          <Input size="large" inputMode="tel" className="rounded-xl" />
        </Form.Item>

        <div className="flex-1" />

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="rounded-lg text-[15px] font-semibold"
            icon={<ArrowRightOutlined />}
            iconPlacement="end"
          >
            Submit Registration
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
