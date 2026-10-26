import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  MoreOutlined,
  SearchOutlined,
  SyncOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Input, message, Modal, type MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";

import DashboardHeader from "@/components/layout/dashboard-header";
import TableComponent from "@/components/ui/table";
import { TablePaginationFooter } from "@/components/ui/table-pagination-footer";
import { getVisitActionErrorMessage, type VisitorRow } from "../utils/visits";
import { useVisitorTableData } from "../hooks/use-visitor-table-data";
import StatusPill from "./visit-status-pill";
import {
  AppointmentActionModal,
  AppointmentCreatedModal,
  AppointmentDetailsDrawer,
  AppointmentEditModal,
  CreateAppointmentModal,
  type CreatedAppointment,
} from "./appointment-flows";
import {
  useApproveVisitMutation,
  useRejectVisitMutation,
} from "../api/admins-visit-api-slice";

const PAGE_SIZE = 10;

function SummaryCard({
  label,
  value,
  icon,
  tone,
  selected,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "blue" | "green" | "red" | "amber";
  selected: boolean;
  onClick: () => void;
}) {
  const tones = {
    blue: "bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-300",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300",
    red: "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300",
  };

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex min-w-0 items-center gap-3 rounded-xl border bg-white p-3 text-left transition-colors dark:bg-slate-800 ${
        selected
          ? "border-sky-500 ring-1 ring-sky-500"
          : "border-slate-100 hover:border-sky-300 dark:border-slate-800 dark:hover:border-sky-700"
      }`}
    >
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tones[tone]}`}>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{label}</span>
        <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
          {value.toLocaleString()}
        </span>
      </span>
    </button>
  );
}

export default function AppointmentsPage() {
  const client = useApolloClient();
  const { data: currentUser } = useAdminAuthSession();
  const role = currentUser?.role;
  const isHost = role === "HOST";
  const isFrontDesk = role === "FRONTDESK";
  const canCreateAppointment =
    isHost || role === "FACILITY" || role === "ADMIN" || role === "FRONTDESK";
  const canReviewAppointments = role === "ADMIN" || role === "FACILITY";
  const canManageAppointments = role === "FACILITY" || role === "ADMIN";
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [rejectionAppointment, setRejectionAppointment] = useState<VisitorRow | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [activeAppointmentTab, setActiveAppointmentTab] =
    useState("ALL");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState<CreatedAppointment | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<CreatedAppointment | null>(null);
  const [activeAction, setActiveAction] = useState<{
    mode: "cancel" | "reschedule";
    appointment: VisitorRow;
  } | null>(null);
  const [appointmentToEdit, setAppointmentToEdit] = useState<VisitorRow | null>(null);

  const {
    visitorRecords: queriedAppointments,
    totalEntries,
    isLoading,
    isError,
    errorMessage,
    refetch,
    appointmentCounts,
  } = useVisitorTableData({
    page,
    limit: PAGE_SIZE,
    search,
    statusGroup: canReviewAppointments || isFrontDesk ? "appointments" : undefined,
    status: canReviewAppointments
      ? activeAppointmentTab
      : isFrontDesk
        ? activeAppointmentTab === "ALL"
          ? undefined
          : activeAppointmentTab
        : isHost
          ? undefined
          : "APPROVED",
  });
  const visitorRecords = isHost
    ? queriedAppointments.filter(
        (appointment) =>
          appointment.host.trim().toLowerCase() === currentUser?.fullName.trim().toLowerCase(),
      )
    : queriedAppointments;
  const [approveVisit, { isLoading: isApproving }] = useApproveVisitMutation();
  const [rejectVisit, { isLoading: isRejecting }] = useRejectVisitMutation();
  const isUpdating = isApproving || isRejecting;

  const refreshAppointments = async () => {
    await client.refetchQueries({ include: ["Visits", "AppointmentVisits"] });
  };

  const handleUpdate = async (
    action: "approve" | "reject",
    appointment: VisitorRow,
    reason?: string,
  ): Promise<boolean> => {
    if (!canReviewAppointments) {
      message.error("Your role does not have permission to perform this appointment action.");
      return false;
    }

    try {
      if (action === "approve") {
        await approveVisit(appointment.id).unwrap();
        message.success("Appointment approved.");
      } else if (action === "reject") {
        await rejectVisit({ id: appointment.id, reason: reason?.trim() ?? "" }).unwrap();
        message.success("Appointment rejected.");
      }

      await refreshAppointments();
      return true;
    } catch (error) {
      message.error(
        getVisitActionErrorMessage(error, "The appointment could not be updated. Please try again."),
      );
      return false;
    }
  };

  const handleMenuAction = (key: string, appointment: VisitorRow) => {
    if (key === "view") {
      setSelectedAppointment({
        visitor: appointment,
        requestedDate: appointment.requestedDate ?? "",
        requestedTime: appointment.requestedTime ?? "",
      });
    } else if (key === "edit" && canManageAppointments) {
      setAppointmentToEdit(appointment);
    } else if ((key === "cancel" || key === "reschedule") && canManageAppointments) {
      setActiveAction({ mode: key, appointment });
      setSelectedAppointment(null);
    } else if (key === "approve") {
      void handleUpdate(key, appointment);
    } else if (key === "reject") {
      setRejectionAppointment(appointment);
      setRejectionReason("");
    }
  };

  const getActionMenu = (appointment: VisitorRow): MenuProps => {
    const items: NonNullable<MenuProps["items"]> = [
      { key: "view", label: "View" },
    ];

    if (canManageAppointments) {
      items.push(
        { key: "edit", label: "Edit" },
        { key: "reschedule", label: "Reschedule" },
        { key: "cancel", label: "Cancel", danger: true },
      );
    }

    if (canReviewAppointments && appointment.status === "Pending") {
      items.splice(
        1,
        0,
        { key: "approve", label: "Approve Appointment" },
        { key: "reject", label: "Reject Appointment", danger: true },
      );
    }

    return {
      items,
      onClick: ({ key }) => handleMenuAction(key, appointment),
    };
  };

  const columns: ColumnsType<VisitorRow> = [
    {
      title: "Visitor Name",
      dataIndex: "name",
      key: "name",
      render: (_name, appointment) => (
        <div className="flex min-w-32 flex-col">
          <span className="text-xs font-medium text-slate-800 dark:text-slate-100">
            {appointment.name}
          </span>
          <span className="text-[11px] text-slate-400">{appointment.email}</span>
        </div>
      ),
    },
    {
      title: "Submitted",
      dataIndex: "time",
      key: "submitted",
      render: (_date, appointment) => (
        <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
          {appointment.time}
        </span>
      ),
    },
    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
      render: (purpose: string) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">{purpose}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: VisitorRow["status"]) => <StatusPill status={status} />,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_value, appointment) => (
        <Dropdown menu={getActionMenu(appointment)} trigger={["click"]} disabled={isUpdating}>
          <Button
            type="text"
            size="small"
            aria-label={`Actions for ${appointment.name}`}
            icon={<MoreOutlined />}
          />
        </Dropdown>
      ),
    },
  ];

  const handleCreated = (appointment: CreatedAppointment) => {
    setIsCreateOpen(false);
    setCreatedAppointment(appointment);
    void refreshAppointments().catch(() =>
      message.error("Appointment created, but the list could not be refreshed."),
    );
  };

  const handleViewCreated = () => {
    setSelectedAppointment(createdAppointment);
    setCreatedAppointment(null);
  };

  return (
    <>
      <DashboardHeader title="Appointments" />
      <main className="flex-1 space-y-4 px-3 pt-2 pb-5 sm:px-5 md:px-6 md:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Appointment
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isFrontDesk
                ? "View appointments across all statuses. Check-ins and check-outs are managed separately."
                : "Admins and facility staff review pending appointments here. Check-ins and check-outs are managed separately."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(isFrontDesk || canReviewAppointments) && (
              <Button
                icon={<SyncOutlined />}
                loading={isLoading}
                onClick={() => {
                  void refetch().catch(() =>
                    message.error("Appointments could not be refreshed."),
                  );
                }}
              >
                Refresh
              </Button>
            )}
            {canCreateAppointment && (
              <Button
                type="primary"
                icon={<CalendarOutlined />}
                onClick={() => setIsCreateOpen(true)}
              >
                Create Appointment
              </Button>
            )}
          </div>
        </div>

        {(canReviewAppointments || isFrontDesk) && (
          <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <SummaryCard
              label="Total"
              value={appointmentCounts?.total ?? 0}
              icon={<TeamOutlined />}
              tone="blue"
              selected={activeAppointmentTab === "ALL"}
              onClick={() => {
                setActiveAppointmentTab("ALL");
                setPage(1);
              }}
            />
            <SummaryCard
              label="Approved"
              value={appointmentCounts?.approved ?? 0}
              icon={<CheckCircleOutlined />}
              tone="green"
              selected={activeAppointmentTab === "APPROVED"}
              onClick={() => {
                setActiveAppointmentTab("APPROVED");
                setPage(1);
              }}
            />
            <SummaryCard
              label="Rejected"
              value={appointmentCounts?.rejected ?? 0}
              icon={<CloseCircleOutlined />}
              tone="red"
              selected={activeAppointmentTab === "REJECTED"}
              onClick={() => {
                setActiveAppointmentTab("REJECTED");
                setPage(1);
              }}
            />
            <SummaryCard
              label="Pending"
              value={appointmentCounts?.pending ?? 0}
              icon={<ClockCircleOutlined />}
              tone="amber"
              selected={activeAppointmentTab === "PENDING"}
              onClick={() => {
                setActiveAppointmentTab("PENDING");
                setPage(1);
              }}
            />
          </section>
        )}

        <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 dark:border-slate-700">
            <Input
              allowClear
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Search by name, email or purpose"
              className="sm:max-w-xs"
            />
            <span className="text-xs text-slate-500">
              <UserOutlined className="mr-1" />
              {isHost
                ? `${visitorRecords.length.toLocaleString()} of your appointments`
                : canReviewAppointments
                  ? `${totalEntries.toLocaleString()} appointments`
                  : isFrontDesk
                    ? `${totalEntries.toLocaleString()} appointments`
                  : `${totalEntries.toLocaleString()} approved appointments`}
            </span>
          </div>

          <TableComponent<VisitorRow>
            columns={columns}
            dataSource={visitorRecords}
            rowKey="id"
            className="appointment-table"
            size="small"
            showSerialNumber
            serialNumberTitle="S/N"
            startIndex={(page - 1) * PAGE_SIZE + 1}
            onRow={(appointment) => ({
              onDoubleClick: () =>
                setSelectedAppointment({
                  visitor: appointment,
                  requestedDate: appointment.requestedDate ?? "",
                  requestedTime: appointment.requestedTime ?? "",
                }),
            })}
          />

          {isLoading && (
            <div className="px-4 py-3 text-center text-xs text-slate-500">Loading appointments…</div>
          )}
          {isError && (
            <div role="alert" className="px-4 py-3 text-xs text-rose-600">
              Appointments could not be loaded: {errorMessage ?? "Please refresh and try again."}
            </div>
          )}

          <TablePaginationFooter
            page={page}
            pageSize={PAGE_SIZE}
            totalEntries={totalEntries}
            onPageChange={setPage}
          />
        </section>
      </main>

      <CreateAppointmentModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={handleCreated}
        hostName={role === "HOST" ? currentUser?.fullName : undefined}
      />
      <AppointmentCreatedModal
        appointment={createdAppointment}
        onClose={() => setCreatedAppointment(null)}
        onView={handleViewCreated}
      />
      <AppointmentDetailsDrawer
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onEdit={(appointment) => {
          if (canManageAppointments) {
            setAppointmentToEdit(appointment);
            setSelectedAppointment(null);
          }
        }}
        onCancelAppointment={(appointment) => {
          if (canManageAppointments) {
            setActiveAction({ mode: "cancel", appointment });
            setSelectedAppointment(null);
          }
        }}
        onReschedule={(appointment) => {
          if (canManageAppointments) {
            setActiveAction({ mode: "reschedule", appointment });
            setSelectedAppointment(null);
          }
        }}
        canManage={canManageAppointments}
      />
      <AppointmentActionModal
        mode={activeAction?.mode ?? "cancel"}
        appointment={activeAction?.appointment ?? null}
        onClose={() => setActiveAction(null)}
      />
      <AppointmentEditModal
        appointment={appointmentToEdit}
        onClose={() => setAppointmentToEdit(null)}
      />
      <Modal
        title="Reject appointment"
        open={Boolean(rejectionAppointment)}
        onCancel={() => {
          setRejectionAppointment(null);
          setRejectionReason("");
        }}
        onOk={async () => {
          if (!rejectionAppointment || !rejectionReason.trim()) return;
          const rejected = await handleUpdate(
            "reject",
            rejectionAppointment,
            rejectionReason,
          );
          if (rejected) {
            setRejectionAppointment(null);
            setRejectionReason("");
          }
        }}
        okText="Reject appointment"
        okButtonProps={{ danger: true, disabled: !rejectionReason.trim() }}
        confirmLoading={isUpdating}
        destroyOnHidden
      >
        <p className="mb-2 text-sm text-slate-600">
          Provide a reason for rejecting {rejectionAppointment?.name}&apos;s appointment.
        </p>
        <Input.TextArea
          value={rejectionReason}
          onChange={(event) => setRejectionReason(event.target.value)}
          placeholder="Enter rejection reason"
          rows={4}
          maxLength={500}
          showCount
        />
      </Modal>
    </>
  );
}
