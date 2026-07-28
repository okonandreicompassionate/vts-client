import { ArrowLeftOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import { Button, Input, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/layout/Header.tsx";
import ApproveAccessModal from "../components/modals/ApproveAccessModal";
import AccessApprovedModal from "../components/modals/AccessApprovedModal";
import AccessRejectedModal from "../components/modals/AccessRejectedModal";
import { paths } from "../../../config/paths";
import { useApproveVisitMutation, useGetVisitsQuery } from "../../../lib/api";
import { toVisitorRow, type VisitorRow } from "../utils/visits";

const { TextArea } = Input;

const fallbackVisitor = (id?: string): VisitorRow => ({
  id: id ?? "unknown",
  name: "Visitor unavailable",
  email: "N/A",
  phone: "N/A",
  avatar: "https://i.pravatar.cc/40?u=unknown",
  host: "N/A",
  purpose: "N/A",
  status: "Pending",
  time: "Pending",
  checkIn: "Pending",
  checkOut: "Pending",
  department: "N/A",
});

export default function ReviewVisitor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [notes, setNotes] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showRejectSuccess, setShowRejectSuccess] = useState(false);
  const { data: visitsData } = useGetVisitsQuery({
    page: 1,
    limit: 20,
    search: id,
  });
  const [approveVisit, { isLoading: isApproving }] = useApproveVisitMutation();

  const visitor = useMemo<VisitorRow>(() => {
    const visitorRecords = visitsData?.records.map(toVisitorRow) ?? [];

    return (
      visitorRecords.find((item) => item.id === id) ?? visitorRecords[0] ?? fallbackVisitor(id)
    );
  }, [id, visitsData?.records]);

  const detailRows: { label: string; value: string }[] = [
    { label: "Visitor Name", value: visitor.name },
    { label: "Email Address", value: visitor.email },
    { label: "Phone Number", value: visitor.phone },
    { label: "Host Name", value: visitor.host },
    { label: "Department", value: visitor.department },
    { label: "Purpose of Visit", value: visitor.purpose },
    { label: "Check-In Time", value: visitor.checkIn },
  ];

  const accessDetails = [
    { label: "Access Level", value: "Standard Visitor" },
    { label: "Valid Until", value: "End of visit" },
    { label: "Entry Point", value: "Main Lobby - Gate A" },
  ];

  const handleApprove = () => {
    setShowConfirm(true);
  };

  const handleConfirmApprove = async () => {
    try {
      await approveVisit(visitor.id).unwrap();
      setShowConfirm(false);
      setShowSuccess(true);
    } catch (error) {
      console.error(error);
      message.error("Unable to approve visitor. Please try again.");
    }
  };

  const handleReject = () => {
    setShowRejectSuccess(true);
  };

  return (
    <>
      <Header title="Review Visitor" />

      <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
        <Button
          type="link"
          icon={<ArrowLeftOutlined className="text-xs" />}
          className="mb-4 px-0! font-medium text-sky-500!"
          onClick={() => navigate(paths.admin.visitors.getHref())}
        >
          Back to List
        </Button>

        <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
          <div className="w-full rounded-xl border border-slate-100 bg-white px-4 py-5 shadow-sm shadow-slate-100 sm:px-6 sm:py-6 md:px-7 md:py-7 xl:flex-1">
            <div className="mb-6 flex items-center gap-4">
              <img
                src={visitor.avatar}
                alt={visitor.name}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <h3 className="text-base leading-tight font-bold text-slate-800">
                  {visitor.name}
                </h3>
                <span className="mt-1.5 inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-400">
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
                loading={isApproving}
                className="h-11! bg-emerald-500! font-semibold hover:bg-emerald-600!"
              >
                Approve Access
              </Button>
            </div>
          </div>
        </div>
      </main>

      <ApproveAccessModal
        visible={showConfirm}
        onConfirm={handleConfirmApprove}
        onCancel={() => setShowConfirm(false)}
        visitorName={visitor.name}
      />

      <AccessApprovedModal
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        accessDetails={accessDetails}
      />

      <AccessRejectedModal
        visible={showRejectSuccess}
        onClose={() => setShowRejectSuccess(false)}
      />
    </>
  );
}
