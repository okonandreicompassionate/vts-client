import { useApolloClient } from "@apollo/client/react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Drawer, Input, message, Modal, Tabs } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";

import DashboardHeader from "@/components/layout/dashboard-header";
import TableComponent from "@/components/ui/table";
import { TablePaginationFooter } from "@/components/ui/table-pagination-footer";
import { useCheckInVisitMutation } from "@/features/visits/api/admins-visit-api-slice";
import { useGetProfileQuery } from "@/features/settings/api/settings-api-slice";
import { useVisitorTableData } from "@/features/visits/hooks/use-visitor-table-data";
import type { VisitorRow } from "@/features/visits/utils/visits";
import StatusPill from "./visit-status-pill";
import Visitors from "./visitors-page";

const PAGE_SIZE = 10;
const frontDeskTabs = [
  { key: "all", label: "All" },
  { key: "appointment", label: "Appointment" },
  { key: "check-ins", label: "Check-ins" },
] as const;

type FrontDeskTab = (typeof frontDeskTabs)[number]["key"];
const frontDeskStatusByTab: Record<FrontDeskTab, string | undefined> = {
  all: undefined,
  appointment: "PENDING",
  "check-ins": "APPROVED",
};

function FrontDeskVisitors() {
  const client = useApolloClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FrontDeskTab>("all");
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorRow | null>(null);
  const [visitorToCheckIn, setVisitorToCheckIn] = useState<VisitorRow | null>(null);

  const { visitorRecords, totalEntries, isLoading, isError } = useVisitorTableData({
    page,
    limit: PAGE_SIZE,
    search,
    status: frontDeskStatusByTab[activeTab],
  });
  const [checkInVisit, { isLoading: isCheckingIn }] = useCheckInVisitMutation();

  const handleCheckIn = async () => {
    if (!visitorToCheckIn) return;

    try {
      await checkInVisit(visitorToCheckIn.id).unwrap();
      await client.refetchQueries({ include: ["Visits"] });
      message.success(`${visitorToCheckIn.name} checked in successfully.`);
      setVisitorToCheckIn(null);
    } catch {
      message.error("Visitor check-in could not be completed. Please try again.");
    }
  };

  const columns: ColumnsType<VisitorRow> = [
    {
      title: "Visitor",
      dataIndex: "name",
      key: "visitor",
      render: (_name, visitor) => (
        <div className="flex min-w-32 flex-col">
          <span className="text-xs font-medium text-slate-800 dark:text-slate-100">
            {visitor.name}
          </span>
          <span className="text-[11px] text-slate-400">{visitor.email}</span>
        </div>
      ),
    },
    {
      title: "Host",
      dataIndex: "host",
      key: "host",
      render: (host: string) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">{host}</span>
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
      title: "Visit Date",
      dataIndex: "time",
      key: "visit-date",
      render: (time: string) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">{time}</span>
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
      render: (_value, visitor) => (
        <div className="flex justify-center gap-2">
          <Button size="small" onClick={() => setSelectedVisitor(visitor)}>
            View
          </Button>
          {visitor.status === "Approved" && (
            <Button
              size="small"
              type="primary"
              onClick={() => setVisitorToCheckIn(visitor)}
              disabled={isCheckingIn}
            >
              Check
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <DashboardHeader title="Visitors" />
      <main className="flex-1 space-y-4 px-3 pt-2 pb-5 sm:px-5 md:px-6 md:py-5">
        <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800">
          <Tabs
            activeKey={activeTab}
            items={frontDeskTabs.map((tab) => ({ key: tab.key, label: tab.label }))}
            onChange={(key) => {
              const tab = frontDeskTabs.find((item) => item.key === key);
              if (tab) {
                setActiveTab(tab.key);
                setPage(1);
              }
            }}
            className="px-4"
          />
          <div className="flex flex-col gap-3 border-b border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 dark:border-slate-700">
            <Input
              allowClear
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Search visitors"
              className="sm:max-w-xs"
            />
            <span className="text-xs text-slate-500">
              {totalEntries.toLocaleString()} visitors
            </span>
          </div>
          <TableComponent<VisitorRow>
            columns={columns}
            dataSource={visitorRecords}
            rowKey="id"
            size="small"
            showSerialNumber
            serialNumberTitle="S/N"
            startIndex={(page - 1) * PAGE_SIZE + 1}
            onRow={(visitor) => ({ onDoubleClick: () => setSelectedVisitor(visitor) })}
          />
          {isLoading && (
            <div className="px-4 py-3 text-center text-xs text-slate-500">Loading visitors…</div>
          )}
          {isError && (
            <div role="alert" className="px-4 py-3 text-xs text-rose-600">
              Visitors could not be loaded. Please refresh and try again.
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

      <Modal
        title="Confirm visitor check-in"
        open={Boolean(visitorToCheckIn)}
        onCancel={() => setVisitorToCheckIn(null)}
        onOk={() => void handleCheckIn()}
        okText="Confirm Check-in"
        confirmLoading={isCheckingIn}
        okButtonProps={{ disabled: !visitorToCheckIn || visitorToCheckIn.status !== "Approved" }}
        destroyOnHidden
      >
        {visitorToCheckIn && (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Confirm that <strong>{visitorToCheckIn.name}</strong> has arrived for{" "}
            <strong>{visitorToCheckIn.purpose}</strong>.
          </p>
        )}
      </Modal>

      <Drawer
        title="Visitor Details"
        placement="right"
        width="min(100vw, 420px)"
        open={Boolean(selectedVisitor)}
        onClose={() => setSelectedVisitor(null)}
        destroyOnHidden
      >
        {selectedVisitor && (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-100 dark:border-slate-700">
              <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {selectedVisitor.name}
                </h2>
                <p className="mt-1 text-xs text-slate-500">{selectedVisitor.email}</p>
              </div>
              <dl className="divide-y divide-slate-100 dark:divide-slate-700">
                {[
                  ["Phone Number", selectedVisitor.phone],
                  ["Host", selectedVisitor.host],
                  ["Purpose", selectedVisitor.purpose],
                  ["Status", selectedVisitor.status],
                  ["Visit Date", selectedVisitor.time],
                  ["Check-in Time", selectedVisitor.checkIn],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 px-4 py-3">
                    <dt className="text-xs text-slate-500">{label}</dt>
                    <dd className="text-xs text-slate-800 dark:text-slate-100">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            {selectedVisitor.status === "Approved" && (
              <Button
                type="primary"
                block
                onClick={() => {
                  setVisitorToCheckIn(selectedVisitor);
                  setSelectedVisitor(null);
                }}
              >
                Check In Visitor
              </Button>
            )}
          </div>
        )}
      </Drawer>
    </>
  );
}

export default function VisitorsRolePage() {
  const { data: profile } = useGetProfileQuery();

  return profile?.role === "FRONTDESK" || profile?.role === "SECURITY" ? (
    <FrontDeskVisitors />
  ) : (
    <Visitors />
  );
}
