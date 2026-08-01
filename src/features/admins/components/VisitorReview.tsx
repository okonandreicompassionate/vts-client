import { ArrowLeftOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import { Button, Input, Spin, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { usePopup } from "../../../hooks/usePopup";
import Header from "../components/layout/Header.tsx";
import ApproveAccessModal from "../components/modals/ApproveAccessModal";
import AccessApprovedModal from "../components/modals/AccessApprovedModal";
import AccessRejectedModal from "../components/modals/AccessRejectedModal";
import { VisitorAvatar } from "../components/visitor-avatar.tsx";
import { useVisitorTableData } from "../hooks/use-visitor-table-data";
import { useApproveVisitMutation } from "../api/admin-api";
import type { VisitorRow } from "../utils/visits";

const { TextArea } = Input;

export default function ReviewVisitor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const { openModal } = usePopup();
  const [approveVisit] = useApproveVisitMutation();

  const { visitorRecords } = useVisitorTableData({
    page: 1,
    limit: 100,
  });

  const visitor = useMemo<VisitorRow | undefined>(() => {
    return visitorRecords.find((item) => item.id === id);
  }, [id, visitorRecords]);

  const detailRows: { label: string; value: string }[] = visitor
    ? [
        { label: "Visitor Name", value: visitor.name },
        { label: "Email Address", value: visitor.email },
        { label: "Phone Number", value: visitor.phone },
        { label: "Host Name", value: visitor.host },
        { label: "Department", value: visitor.department },
        { label: "Purpose of Visit", value: visitor.purpose },
        { label: "Check-In Time", value: visitor.time },
      ]
    : [];

  const handleApprove = () => {
    openModal(<ApproveAccessModal visitorName={visitor?.name} onConfirm={handleConfirmApprove} />);
  };

  const handleConfirmApprove = async () => {
    if (!id) {
      message.error("Visitor ID is missing.");
      return;
    }

    try {
      await approveVisit(id).unwrap();
      openModal(
        <AccessApprovedModal
          accessDetails={[
            { label: "Access Level", value: "Standard Visitor" },
            {
              label: "Valid Until",
              value: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString(),
            },
            { label: "Entry Point", value: "Main Entrance" },
          ]}
        />,
      );
    } catch {
      message.error("Approval could not be completed. Please try again.");
    }
  };

  const handleReject = () => {
    openModal(
      <AccessRejectedModal
        rejectedBy={visitor?.host || "Admin"}
        date={new Date().toLocaleString()}
      />,
    );
  };

  if (!visitor) {
    return (
      <>
        <Header title="Review Visitor" />
        <main className="flex flex-1 items-center justify-center px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
          <Spin size="large" />
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Review Visitor" />

      <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
        <Button
          type="link"
          icon={<ArrowLeftOutlined className="text-xs" />}
          onClick={() => navigate(-1)}
          className="mb-4 px-0! font-medium text-sky-500!"
        >
          Back to List
        </Button>

        <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
          {/* Visitor details card */}
          <div className="w-full rounded-xl border border-slate-100 bg-white px-4 py-5 shadow-sm shadow-slate-100 sm:px-6 sm:py-6 md:px-7 md:py-7 xl:flex-1">
            <div className="mb-6 flex items-center gap-4">
              <VisitorAvatar name={visitor.name} size="lg" />
              <div>
                <h3 className="text-base leading-tight font-bold text-slate-800">{visitor.name}</h3>
                <span
                  className={`mt-1.5 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    visitor.status === "Signed In"
                      ? "bg-emerald-50 text-emerald-500"
                      : visitor.status === "Pending"
                        ? "bg-orange-50 text-orange-400"
                        : visitor.status === "Signed Off"
                          ? "bg-slate-100 text-slate-500"
                          : "bg-rose-50 text-rose-500"
                  }`}
                >
                  {visitor.status}
                </span>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-100">
              {detailRows.map((row, idx) => (
                <div
                  key={row.label}
                  className={`flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:items-center sm:px-5 ${idx !== detailRows.length - 1 ? "border-b border-slate-100" : ""}`}
                >
                  <span className="w-full shrink-0 text-sm text-slate-400 sm:w-40">
                    {row.label}
                  </span>
                  <span className="text-sm text-slate-700">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review and approve card */}
          <div className="w-full rounded-xl border border-slate-100 bg-white px-4 py-5 shadow-sm shadow-slate-100 sm:px-6 sm:py-6 xl:w-96 xl:shrink-0">
            <h3 className="mb-2 text-base font-bold text-slate-800">Review and Approve</h3>
            <p className="mb-5 text-sm leading-relaxed text-slate-400">
              Please verify the visitor information before granting access to the building. You can
              add internal notes below for audit purposes.
            </p>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Notes (Optional)
            </label>
            <TextArea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes here.."
              rows={4}
              className="mb-5 rounded-lg"
            />

            <div className="flex items-center gap-3">
              <Button danger block className="h-11! font-semibold" onClick={handleReject}>
                Reject Visitor
              </Button>
              <Button
                type="primary"
                block
                onClick={handleApprove}
                className="h-11! bg-emerald-500! font-semibold hover:bg-emerald-600!"
              >
                Approve Access
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
