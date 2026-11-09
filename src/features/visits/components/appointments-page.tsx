import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, message } from "antd";
import { RowActions } from "@/components/ui/row-actions";
import { getAppointmentActions } from "../utils/appointment-row-actions";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";
import { adminRoles, hasRole, reviewerRoles } from "@/types/user-role";
import { usePopup } from "@/lib/contexts/popup/use-popup";

import {
  DataTableCard,
  FilterBar,
  PageShell,
  StatCards,
  type StatCardItem,
  RefreshButton,
} from "@/components/page";
import type { VisitorRow } from "../utils/visits";
import { useVisitorTableData } from "../hooks/use-visitor-table-data";
import { useVisitReport } from "../hooks/use-visit-report";
import { statusColumns, visitorColumns } from "./visitor-columns";
import {
  AppointmentActionModal,
  AppointmentDetailsDrawer,
  AppointmentEditModal,
  CreateAppointmentModal,
} from "./appointment-flows";
import RejectAppointmentModal from "./modals/reject-appointment-modal";
import HostDecisionModal from "./modals/host-decision-modal";
import { useVisitorCheckActions } from "../hooks/use-visitor-check-actions";

type AppointmentTab = "ALL" | "APPROVED" | "REJECTED" | "PENDING";

export default function AppointmentsPage() {
  const { openModal, openDrawer } = usePopup();
  const { data: currentUser } = useAdminAuthSession();
  const role = currentUser?.role;
  const isHost = role === "HOST";
  const isFrontDesk = role === "FRONTDESK";
  const canCreateAppointment = isHost || role === "FRONTDESK" || hasRole(role, reviewerRoles);
  const canReviewAppointments = hasRole(role, reviewerRoles);
  // Matches the server: a visit's host, or an admin, may edit, reschedule or cancel it.
  const canManageAppointments = hasRole(role, adminRoles) || role === "HOST";
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [activeAppointmentTab, setActiveAppointmentTab] = useState<AppointmentTab>("ALL");

  const tableFilters = {
    search,
    statusGroup: canReviewAppointments || isFrontDesk ? ("appointments" as const) : undefined,
    status: canReviewAppointments
      ? activeAppointmentTab
      : isFrontDesk
        ? activeAppointmentTab === "ALL"
          ? undefined
          : activeAppointmentTab
        : isHost
          ? undefined
          : "APPROVED",
  };

  // The server only returns a host's own appointments.
  const {
    visitorRecords,
    totalEntries,
    isLoading,
    isError,
    errorMessage,
    refetch,
    appointmentCounts,
  } = useVisitorTableData({
    page,
    limit: pageSize,
    ...tableFilters,
  });
  const { generateVisitReport, isGeneratingReport } = useVisitReport("appointments");
  const { confirmApprove, isApproving } = useVisitorCheckActions();

  const openDetails = (appointment: VisitorRow) =>
    openDrawer(
      <AppointmentDetailsDrawer
        appointment={{
          visitor: appointment,
          requestedDate: appointment.requestedDate ?? "",
          requestedTime: appointment.requestedTime ?? "",
        }}
        canManage={canManageAppointments}
      />,
    );

  const handleApprove = (appointment: VisitorRow) => {
    if (!canReviewAppointments) {
      message.error("Your role does not have permission to perform this appointment action.");
      return;
    }

    confirmApprove(appointment);
  };

  const renderActions = (appointment: VisitorRow) => (
    <RowActions
      label={appointment.name}
      {...getAppointmentActions(appointment, {
        canReview: canReviewAppointments,
        canManage: canManageAppointments,
        currentUserId: currentUser?.id,
        onHostDecide: (row, decision) =>
          openModal(<HostDecisionModal appointment={row} decision={decision} />),
        busy: isApproving,
        onView: openDetails,
        onApprove: handleApprove,
        onReject: (row) => openModal(<RejectAppointmentModal appointment={row} />),
        onEdit: (row) => openModal(<AppointmentEditModal appointment={row} />),
        onReschedule: (row) =>
          openModal(<AppointmentActionModal mode="reschedule" appointment={row} />),
        onCancel: (row) => openModal(<AppointmentActionModal mode="cancel" appointment={row} />),
      })}
    />
  );

  // A status card filters the table to one status; the pill would repeat it on every row.
  const hasStatusTabs = canReviewAppointments || isFrontDesk;
  const columns: ColumnsType<VisitorRow> = [
    visitorColumns.visitId(),
    visitorColumns.visitor("email", false),
    visitorColumns.visitDate(),
    // Hosts only see their own appointments.
    ...(isHost ? [] : [visitorColumns.host()]),
    visitorColumns.purpose(),
    ...statusColumns({
      showStatus: !hasStatusTabs || activeAppointmentTab === "ALL",
      showCheckIn: false,
      showCheckOut: false,
    }),
    visitorColumns.actions(renderActions),
  ];

  const statItems: StatCardItem<AppointmentTab>[] = [
    {
      key: "ALL",
      label: "Total",
      value: appointmentCounts?.total ?? 0,
      icon: <TeamOutlined />,
      tone: "sky",
    },
    {
      key: "APPROVED",
      label: "Approved",
      value: appointmentCounts?.approved ?? 0,
      icon: <CheckCircleOutlined />,
      tone: "emerald",
    },
    {
      key: "REJECTED",
      label: "Rejected",
      value: appointmentCounts?.rejected ?? 0,
      icon: <CloseCircleOutlined />,
      tone: "rose",
    },
    {
      key: "PENDING",
      label: "Pending",
      value: appointmentCounts?.pending ?? 0,
      icon: <ClockCircleOutlined />,
      tone: "amber",
    },
  ];

  const generateAppointmentReport = () =>
    generateVisitReport({
      ...tableFilters,
      columns: [
        { header: "ID", value: (row) => row.id },
        { header: "Visitor", value: (row) => row.name },
        { header: "Email", value: (row) => row.email },
        { header: "Phone", value: (row) => row.phone },
        { header: "Host", value: (row) => row.host },
        { header: "Purpose", value: (row) => row.purpose },
        { header: "Status", value: (row) => row.status },
        { header: "Submitted", value: (row) => row.time },
        { header: "Requested date", value: (row) => row.requestedDate },
        { header: "Requested time", value: (row) => row.requestedTime },
      ],
    });

  return (
    <PageShell
      fill
      title="Appointments"
      description="Review and manage visit requests."
      actions={
        <>
          {(isFrontDesk || canReviewAppointments) && (
            <RefreshButton
              loading={isLoading}
              onClick={() => {
                void refetch().catch(() => message.error("Appointments could not be refreshed."));
              }}
            />
          )}
          <Button
            icon={<FileTextOutlined />}
            loading={isGeneratingReport}
            onClick={() => void generateAppointmentReport()}
          >
            Generate Report
          </Button>
          {canCreateAppointment && (
            <Button
              type="primary"
              icon={<CalendarOutlined />}
              onClick={() =>
                openModal(
                  <CreateAppointmentModal
                    hostName={role === "HOST" ? currentUser?.fullName : undefined}
                    canManage={canManageAppointments}
                  />,
                )
              }
            >
              Create Appointment
            </Button>
          )}
        </>
      }
    >
      <FilterBar
        search={{
          value: search,
          onChange: (value) => {
            setSearch(value);
            setPage(1);
          },
          placeholder: "Search by name, reference or phone",
        }}
      />

      {hasStatusTabs && (
        <StatCards<AppointmentTab>
          items={statItems}
          activeKey={activeAppointmentTab}
          onSelect={(tab) => {
            setActiveAppointmentTab(tab);
            setPage(1);
          }}
        />
      )}

      <DataTableCard<VisitorRow>
        columns={columns}
        dataSource={visitorRecords}
        rowKey="id"
        className="appointment-table"
        loading={isLoading}
        error={
          isError
            ? {
                message: `Appointments could not be loaded: ${errorMessage ?? "Please refresh and try again."}`,
                onRetry: () => void refetch(),
              }
            : null
        }
        empty={
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            {search ? "No appointments match your search." : "No appointments yet."}
          </p>
        }
        onRowClick={openDetails}
        pagination={{
          page,
          pageSize,
          total: totalEntries,
          onChange: (nextPage, nextPageSize) => {
            setPage(nextPageSize === pageSize ? nextPage : 1);
            setPageSize(nextPageSize);
          },
        }}
      />
    </PageShell>
  );
}
