import { useState } from "react";
import { Select, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ClockCircleOutlined, WarningOutlined, EyeOutlined } from "@ant-design/icons";
import Header from "../components/layout/Header.tsx";
import StatusPill from "../components/StatusPill.tsx";
import TableComponent from "./Table.tsx";
import { TablePaginationFooter } from "./table-pagination-footer.tsx";
import type { VisitorStatus } from "./StatusPill";
import { getVisitorSummary, toApiVisitStatus, type VisitorRow } from "../utils/visits";
import { useVisitorTableData } from "../hooks/use-visitor-table-data";
import { useVisitorRowClick } from "../hooks/use-visitor-row-click";

const statCards = [
  {
    label: "Total Visitors",
    icon: <img src="/visitors2.svg" alt="Total Visitors" />,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    label: "Currently Signed In",
    icon: <img src="/check.svg" alt="Signed In" />,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    label: "Signed Off",
    icon: <img src="/back.svg" alt="Signed Off" />,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
  },
  {
    label: "Pending Approval",
    icon: <ClockCircleOutlined />,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-400",
  },
  {
    label: "Rejected",
    icon: <WarningOutlined />,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-400",
  },
];

type StatusFilter = "All" | VisitorStatus;

const columns: ColumnsType<VisitorRow> = [
  {
    title: "Visitor Name",
    dataIndex: "name",
    key: "name",
    render: (_, record) => (
      <div className="flex items-center gap-3">
        <img src={record.avatar} alt={record.name} className="h-9 w-9 rounded-full object-cover" />
        <div>
          <p className="text-sm leading-tight font-medium text-slate-800">{record.name}</p>
        </div>
      </div>
    ),
  },
  {
    title: "Phone Number",
    dataIndex: "phone",
    key: "phone",
    render: (phone) => <span className="text-sm text-slate-500">{phone}</span>,
  },
  {
    title: "Host Name",
    dataIndex: "host",
    key: "host",
    render: (host) => <span className="text-sm text-slate-600">{host}</span>,
  },
  {
    title: "Purpose",
    dataIndex: "purpose",
    key: "purpose",
    render: (purpose) => <span className="text-sm text-slate-600">{purpose}</span>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => <StatusPill status={status} />,
  },
  {
    title: "Check-In Time",
    dataIndex: "time",
    key: "time",
    render: (time) => <span className="text-sm text-slate-600">{time}</span>,
  },
  {
    title: "Action",
    key: "action",
    align: "center",
    render: () => (
      <Button
        type="text"
        shape="circle"
        icon={<EyeOutlined />}
        aria-label="View visitor"
        className="bg-sky-50! text-sky-500! hover:bg-sky-100!"
      />
    ),
  },
];

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const pageSize = 8;

  const { visitorRecords, totalEntries } = useVisitorTableData({
    page,
    limit: pageSize,
    status: statusFilter === "All" ? undefined : toApiVisitStatus(statusFilter),
  });

  const summary = getVisitorSummary(visitorRecords);
  const handleRowClick = useVisitorRowClick();

  const handleStatusChange = (value: StatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const cardValues = [
    summary.total.toLocaleString(),
    summary.signedIn.toString(),
    summary.signedOff.toString(),
    summary.pending.toString(),
    summary.rejected.toString(),
  ];

  const cards = statCards.map((card, index) => ({
    ...card,
    value: cardValues[index],
  }));

  return (
    <>
      <Header title="Dashboard" />

      <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {cards.map((card) => (
            <div
              key={card.label}
              className="flex items-center gap-2 rounded-md border border-slate-100 bg-white px-2.5 py-2 shadow-sm shadow-slate-100"
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${card.iconBg} ${card.iconColor}`}
              >
                {card.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm leading-none font-semibold text-slate-800">{card.value}</p>
                <p className="mt-0.5 text-[10px] leading-none text-slate-400">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-100 bg-white shadow-sm shadow-slate-100">
          <div className="flex flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
            <h3 className="text-base font-bold text-slate-800">Recent Visitors</h3>
            <div className="grid grid-cols-1 gap-2 sm:flex sm:grid-cols-2 sm:flex-nowrap sm:items-center sm:gap-2">
              <Select
                value={statusFilter}
                onChange={handleStatusChange}
                size="middle"
                className="w-full bg-[#F5FBFE] sm:w-32"
                popupMatchSelectWidth={false}
                options={[
                  { value: "All", label: "Status" },
                  { value: "Signed In", label: "Signed In" },
                  { value: "Pending", label: "Pending" },
                  { value: "Signed Off", label: "Signed Off" },
                  { value: "Rejected", label: "Rejected" },
                ]}
              />
              <Select
                defaultValue="Time"
                size="middle"
                className="w-full bg-[#F5FBFE] sm:w-28"
                popupMatchSelectWidth={false}
                options={[
                  { value: "Time", label: "Time" },
                  { value: "Today", label: "Today" },
                  { value: "This Week", label: "This Week" },
                  { value: "This Month", label: "This Month" },
                ]}
              />
              <Select
                defaultValue="Host Visited"
                size="middle"
                className="w-full bg-[#F5FBFE] sm:col-span-1 sm:w-36"
                popupMatchSelectWidth={false}
                options={[
                  { value: "Host Visited", label: "Host Visited" },
                  { value: "Sarah Smith", label: "Sarah Smith" },
                  { value: "Robert Brown", label: "Robert Brown" },
                  { value: "Emma Davis", label: "Emma Davis" },
                  { value: "Chris Lee", label: "Chris Lee" },
                ]}
              />
            </div>
          </div>

          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <TableComponent<VisitorRow>
              columns={columns}
              dataSource={visitorRecords}
              rowKey="id"
              scroll={{ x: 900 }}
              className="visitor-table"
              size="small"
              showSerialNumber
              startIndex={(page - 1) * pageSize + 1}
              onRow={handleRowClick}
            />
          </div>

          <TablePaginationFooter
            page={page}
            pageSize={pageSize}
            totalEntries={totalEntries}
            onPageChange={setPage}
          />
        </div>
      </main>
    </>
  );
}
