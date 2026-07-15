import { Button, Form, Input, Select, Modal, Checkbox } from "antd";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Registration() {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = () => {
    // send registration to API
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setConfirmed(false);
  };

  const handleConfirm = async () => {
    setSubmitting(true)
    try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setOpen(false)
        setConfirmed(false)
        form.resetFields()
    } finally {
        setSubmitting(false)   
    }
  };

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h1 className="text-lg font-bold text-slate-900">Registration</h1>
        <button
          type="button"
          aria-label="Notifications"
          className="text-slate-500 transition-colors hover:text-slate-700"
        >
          <img src="/bell.svg" alt="" />
        </button>
      </header>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        className="flex flex-1 flex-col px-5 pt-6 pb-8"
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input
            size="large"
            placeholder="e.g. John Doe"
            className="rounded-xl"
          />
        </Form.Item>

        <Form.Item
          name="purposeOfVisit"
          label="Purpose of Visit"
          rules={[{ required: true, message: "Please select a purpose" }]}
        >
          <Select
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
          />
        </Form.Item>

        <Form.Item
          name="hostName"
          label="Host Name"
          rules={[{ required: true, message: "Please enter the host name" }]}
        >
          <Input
            size="large"
            placeholder=""
            className="rounded-xl"
          />
        </Form.Item>

        <Form.Item
          name="department"
          label="Department"
          rules={[{ required: true, message: "Please enter the department" }]}
        >
          <Input
            size="large"
            placeholder="e.g. Human Resources"
            className="rounded-xl"
          />
        </Form.Item>

        <Form.Item
          name="phoneNo"
          label="Phone Number"
          rules={[
            { required: true, message: "Please enter your phone number" },
            {
              pattern: /^[0-9+\-\s]{7,15}$/,
              message: "Please enter a valid phone number",
            },
          ]}
        >
          <Input
            size="large"
            inputMode="tel"
            placeholder="e.g. +234 801 234 5678"
            className="rounded-xl"
          />
        </Form.Item>

        <div className="flex-1" />

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="rounded-lg text-[15px] font-semibold"
            icon={<ArrowRight size={18} />}
            iconPlacement="end"
          >
            Submit Registration
          </Button>
        </Form.Item>
      </Form>

      <Modal
        open={open}
        title="Submit Registration?"
        centered
        mask={{closable: !submitting}}
        onCancel={handleCancel}
        footer={
          <div className="mt-8 flex gap-3">
            <Button
              size="large"
              color="primary"
              variant="outlined"
              onClick={handleCancel}
              className="h-12 flex-1 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              size="large"
              type="primary"
              loading={submitting}
              disabled={!confirmed}
              onClick={handleConfirm}
              className="h-12 flex-1 rounded-lg font-semibold"
            >
              Submit
            </Button>
          </div>
        }
      >
        <div className="">
            Confirm that you want to submit this registration
        </div>
        <div className="pt-3 pb-2">
          <Checkbox
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}>
            I confirm that I want to proceed with this action and understand
            that this will be reviewed.
          </Checkbox>
        </div>
      </Modal>
    </div>
  );
}
