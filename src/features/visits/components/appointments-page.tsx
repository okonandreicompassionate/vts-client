import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, message, Tabs } from "antd";
import { RowActions } from "@/components/ui/row-actions";
import { getAppointmentActions } from "../utils/appointment-row-actions";
import type { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";
import { adminRoles, hasRole, reviewerRoles } from "@/types/user-role";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { useGetPersonalAppointmentsQuery } from "../api/admins-visit-api-slice";

import {
  DataTableCard,
  FilterBar,
  PageShell,
  StatCards,
  type StatCardItem,
  RefreshButton,
} from "@/components/page";
import { isSameHostName, toVisitorRow, type VisitorRow } from "../utils/visits";
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
type AppointmentScope = "ALL" | "MINE";

export default function AppointmentsPage() {
  const { openModal, openDrawer } = usePopup();
  const { data: currentUser } = useAdminAuthSession();
  const role = currentUser?.role;
  const isHost = role === "HOST";
  const isFrontDesk = role === "FRONTDESK";
  const canChooseAppointmentScope = isFrontDesk || hasRole(role, adminRoles);
  const canCreateAppointment = isHost || role === "FRONTDESK" || hasRole(role, reviewerRoles);
  const canChooseAppointmentHost = hasRole(role, adminRoles) || role === "FACILITY";
  const canReviewAppointments = hasRole(role, reviewerRoles);
  // Matches the server: a visit's host, or an admin, may edit, reschedule or cancel it.
  const canManageAppointments = hasRole(role, adminRoles) || role === "HOST";
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [activeAppointmentTab, setActiveAppointmentTab] = useState<AppointmentTab>("ALL");
  const [appointmentScope, setAppointmentScope] = useState<AppointmentScope>("ALL");
  const showingMyAppointments = canChooseAppointmentScope && appointmentScope === "MINE";

  const tableFilters = {
    search,
    statusGroup:
      canReviewAppointments || isFrontDesk || isHost ? ("appointments" as const) : undefined,
    status: canReviewAppointments
      ? activeAppointmentTab
      : isFrontDesk
        ? showingMyAppointments
          ? activeAppointmentTab === "ALL"
            ? undefined
            : activeAppointmentTab
          : "APPROVED"
        : isHost
          ? activeAppointmentTab === "ALL"
            ? undefined
            : activeAppointmentTab
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
    enabled: !showingMyAppointments,
  });
  const myAppointmentsQuery = useGetPersonalAppointmentsQuery(
    { userId: currentUser?.id ?? "", userName: currentUser?.fullName ?? "" },
    {
      skip: !showingMyAppointments || !currentUser?.id || !currentUser.fullName,
    },
  );
  const { generateVisitReport, isGeneratingReport } = useVisitReport("appointments");
  const { confirmApprove, isApproving } = useVisitorCheckActions();

  const matchingMyAppointments = useMemo(
    () =>
      (myAppointmentsQuery.data?.data ?? [])
        .map((visit, index) => toVisitorRow(visit, index))
        .filter((appointment) => {
          const matchesSearch = [
            appointment.name,
            appointment.referenceId,
            appointment.phone,
            appointment.email,
          ].some((value) => value?.toLowerCase().includes(search.trim().toLowerCase()));

          return matchesSearch;
        }),
    [myAppointmentsQuery.data, search],
  );
  const myAppointments = matchingMyAppointments.filter(
    (appointment) =>
      activeAppointmentTab === "ALL" ||
      appointment.status.toUpperCase().replaceAll(" ", "_") === activeAppointmentTab,
  );
  const personalAppointmentCounts = {
    total: matchingMyAppointments.length,
    pending: matchingMyAppointments.filter((appointment) => appointment.status === "Pending")
      .length,
    approved: matchingMyAppointments.filter((appointment) => appointment.status === "Approved")
      .length,
    rejected: matchingMyAppointments.filter((appointment) => appointment.status === "Rejected")
      .length,
  };
  const displayedAppointments = showingMyAppointments
    ? myAppointments.slice((page - 1) * pageSize, page * pageSize)
    : visitorRecords;
  const displayedCounts = showingMyAppointments ? personalAppointmentCounts : appointmentCounts;
  const tableLoading = showingMyAppointments ? myAppointmentsQuery.isFetching : isLoading;
  const personalError = myAppointmentsQuery.error;
  const tableError = showingMyAppointments
    ? personalError
      ? typeof personalError === "object" && "data" in personalError
        ? ((personalError.data as { message?: string } | undefined)?.message ??
          "Please refresh and try again.")
        : "Please refresh and try again."
      : undefined
    : isError
      ? (errorMessage ?? "Please refresh and try again.")
      : undefined;
  const refreshAppointments = async () => {
    if (showingMyAppointments) {
      await myAppointmentsQuery.refetch();
      return;
    }

    await refetch();
  };

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
  const hasStatusTabs = canReviewAppointments || isHost || (isFrontDesk && showingMyAppointments);
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
      value: displayedCounts?.total ?? 0,
      icon: <TeamOutlined />,
      tone: "sky",
    },
    {
      key: "APPROVED",
      label: "Approved",
      value: displayedCounts?.approved ?? 0,
      icon: <CheckCircleOutlined />,
      tone: "emerald",
    },
    {
      key: "REJECTED",
      label: "Rejected",
      value: displayedCounts?.rejected ?? 0,
      icon: <CloseCircleOutlined />,
      tone: "rose",
    },
    {
      key: "PENDING",
      label: "Pending",
      value: displayedCounts?.pending ?? 0,
      icon: <ClockCircleOutlined />,
      tone: "amber",
    },
  ];

  const generateAppointmentReport = () =>
    generateVisitReport({
      ...tableFilters,
      filter:
        showingMyAppointments && currentUser?.id && currentUser.fullName
          ? (row) =>
              row.hostId
                ? row.hostId === currentUser.id
                : isSameHostName(row.host, currentUser.fullName)
          : undefined,
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

  const renderAppointmentContent = () => (
    <>
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
          layout="four"
          activeKey={activeAppointmentTab}
          onSelect={(tab) => {
            setActiveAppointmentTab(tab);
            setPage(1);
          }}
        />
      )}

      <DataTableCard<VisitorRow>
        columns={columns}
        dataSource={displayedAppointments}
        rowKey="id"
        className="appointment-table"
        loading={tableLoading}
        error={
          tableError
            ? {
                message: `Appointments could not be loaded: ${tableError}`,
                onRetry: () => void refreshAppointments(),
              }
            : null
        }
        empty={
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            {search
              ? "No appointments match your search."
              : showingMyAppointments
                ? "No appointments are assigned to you yet."
                : "No appointments yet."}
          </p>
        }
        onRowClick={openDetails}
        pagination={{
          page,
          pageSize,
          total: showingMyAppointments ? myAppointments.length : totalEntries,
          onChange: (nextPage, nextPageSize) => {
            setPage(nextPageSize === pageSize ? nextPage : 1);
            setPageSize(nextPageSize);
          },
        }}
      />
    </>
  );

  return (
    <PageShell
      fill
      title="Appointments"
      description="Review and manage visit requests."
      actions={
        <>
          {(isFrontDesk || canReviewAppointments || isHost) && (
            <RefreshButton
              loading={tableLoading}
              onClick={() => {
                void refreshAppointments().catch(() =>
                  message.error("Appointments could not be refreshed."),
                );
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
                    hostName={
                      canChooseAppointmentHost ? undefined : (currentUser?.fullName ?? "You")
                    }
                    canChooseHost={canChooseAppointmentHost}
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
      {canChooseAppointmentScope ? (
        <Tabs
          activeKey={appointmentScope}
          onChange={(key) => {
            if (key === "ALL" || key === "MINE") {
              setAppointmentScope(key);
              setPage(1);
            }
          }}
          items={[
            { key: "ALL", label: "All appointments", children: renderAppointmentContent() },
            { key: "MINE", label: "My appointments", children: renderAppointmentContent() },
          ]}
        />
      ) : (
        renderAppointmentContent()
      )}
    </PageShell>
  );
}
