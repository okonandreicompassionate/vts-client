import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Button, Input, Modal } from "antd";
import Header from "../components/layout/Header.tsx";

const { TextArea } = Input;

const visitor = {
  name: "Alice Mary Johnson",
  avatar: "https://i.pravatar.cc/160?img=47",
  status: "Pending",
  visitorName: "Alice Mary Johnson",
  email: "alice.j@partnercorp.com",
  phone: "+234 901 234 5678",
  host: "Robert Brown",
  department: "IT Infrastructure",
  purpose: "Network Hardware Delivery",
  checkIn: "Oct 24, 2024 · 10:15 AM (Requested)",
};

const detailRows: { label: string; value: string }[] = [
  { label: "Visitor Name", value: visitor.visitorName },
  { label: "Email Address", value: visitor.email },
  { label: "Phone Number", value: visitor.phone },
  { label: "Host Name", value: visitor.host },
  { label: "Department", value: visitor.department },
  { label: "Purpose of Visit", value: visitor.purpose },
  { label: "Check-In Time", value: visitor.checkIn },
];

const accessDetails = [
  { label: "Access Level", value: "Standard Visitor" },
  { label: "Valid Until", value: "Oct 24, 2022 - 5:00 PM" },
  { label: "Entry Point", value: "Main Lobby - Gate A" },
];

export default function ReviewVisitor() {
  const [notes, setNotes] = useState("");
  const [showApproved, setShowApproved] = useState(false);

  return (
    <>
      <Header title="Review Visitor" />

      <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
        <Button type="link" icon={<ArrowLeftOutlined className="text-xs" />} className="px-0! text-sky-500! font-medium mb-4">
          Back to List
        </Button>

        <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
          {/* Visitor details card */}
          <div className="w-full xl:flex-1 bg-white rounded-xl border border-slate-100 shadow-sm shadow-slate-100 px-4 py-5 sm:px-6 sm:py-6 md:px-7 md:py-7">
            <div className="flex items-center gap-4 mb-6">
              <img src={visitor.avatar} alt={visitor.name} className="w-14 h-14 rounded-full object-cover" />
              <div>
                <h3 className="text-base font-bold text-slate-800 leading-tight">{visitor.name}</h3>
                <span className="mt-1.5 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-400">
                  {visitor.status}
                </span>
              </div>
            </div>

            <div className="border border-slate-100 rounded-lg overflow-hidden">
              {detailRows.map((row, idx) => (
                <div key={row.label}
                  className={`flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:items-center sm:px-5 ${idx !== detailRows.length - 1 ? "border-b border-slate-100" : ""}`}>
                  <span className="w-full shrink-0 text-sm text-slate-400 sm:w-40">{row.label}</span>
                  <span className="text-sm text-slate-700">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review and approve card */}
          <div className="w-full xl:w-96 xl:shrink-0 bg-white rounded-xl border border-slate-100 shadow-sm shadow-slate-100 px-4 py-5 sm:px-6 sm:py-6">
            <h3 className="text-base font-bold text-slate-800 mb-2">Review and Approve</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Please verify the visitor information before granting access to the building. You can add internal notes below for audit purposes.
            </p>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Notes (Optional)</label>
            <TextArea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Enter notes here.." rows={4} className="rounded-lg mb-5" />

            <Button type="primary" block onClick={() => setShowApproved(true)} className="bg-emerald-500! hover:bg-emerald-600! h-11! font-semibold mb-3">
              Approve Access
            </Button>
            <Button danger block className="h-11! font-semibold">
              Reject Visitor
            </Button>
          </div>
        </div>
      </main>

      <Modal
        open={showApproved}
        onCancel={() => setShowApproved(false)}
        footer={false}
        centered
        width={420}
      >
        <div className="text-center pt-2">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-emerald-500">
              <CheckOutlined className="text-lg text-emerald-500" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-800">Access Approved</h3>
          <p className="mt-1.5 text-sm text-slate-400">Visitor access has been successfully approved.</p>

          <div className="mt-6 space-y-3 rounded-xl bg-[#D1FAE5] px-3 py-4 text-left">
            {accessDetails.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4">
                <span className="text-sm text-[#065F46]">{row.label}</span>
                <span className="text-sm font-bold text-[#065F46]">{row.value}</span>
              </div>
            ))}
          </div>

          <Button block onClick={() => setShowApproved(false)} className="h-10! mt-10 border-[#B3DEEF]! text-[#0A96CC]! font-semibold">
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}