import { useNavigate } from "react-router-dom";

import CustomModal from "@/components/ui/custom-modal";
import { paths } from "@/config/paths";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { VISIT_TIME_ZONE } from "@/utils/visit-time";
import type { AvailableAppointment } from "../types/visitor-entry";

export function ConfirmAppointmentModal({
  appointment,
  orgSlug,
  email,
}: {
  appointment: AvailableAppointment;
  orgSlug: string;
  email: string;
}) {
  const navigate = useNavigate();
  const { closeModal } = usePopup();

  const continueToForm = () => {
    closeModal();
    navigate(paths.register.getHref(orgSlug, appointment.id), {
      state: { entryEmail: email },
    });
  };

  return (
    <CustomModal size="sm">
      <CustomModal.Header
        title="Confirm appointment"
        // subtitle="Continue with this appointment to prefill your check-in form."
        // icon={<CalendarCheck size={20} />}
      />
      <CustomModal.Body scroll={false}>
        <dl className="space-y-3 text-xs border rounded-lg border-slate-200 bg-slate-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
          {[
            ["Visit ID", appointment.referenceId],
            ["Visitor", `${appointment.firstName} ${appointment.lastName}`],
            ["Purpose", appointment.purpose],
            ["Host", appointment.hostName || "Unassigned host"],
            [
              "Date and time",
              appointment.scheduledAt
                ? new Date(appointment.scheduledAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: VISIT_TIME_ZONE,
                  })
                : "No scheduled time",
            ],
            ["Status", appointment.status === "APPROVED" ? "Approved" : "Pending approval"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4">
              <dt className="shrink-0 text-slate-500 dark:text-zinc-400">{label}</dt>
              <dd className="text-right font-medium wrap-anywhere text-slate-900 dark:text-zinc-100">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </CustomModal.Body>
      <CustomModal.Footer okText="Continue" onOk={continueToForm} />
    </CustomModal>
  );
}
