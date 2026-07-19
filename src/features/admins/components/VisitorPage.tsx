import { useState } from "react";
import { Table, Button, Input, Pagination } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";
import Header from "../components/layout/Header.tsx";
import StatusPill, { type VisitorStatus } from "../components/StatusPill.tsx";

type FilterTab = "All" | "Signed In" | "Signed Off" | "Pending Approval" | "Rejected";

interface VisitorRecord {
  key: string;
  name: string;
  phone: string;
  avatar: string;
  host: string;
  purpose: string;
  status: VisitorStatus;
  checkIn: string;
}

const visitorData: VisitorRecord[] = [
  { key: "1", name: "Robert Fox", phone: "+234 802 345 6789", avatar: "https://i.pravatar.cc/40?img=12", host: "Emma Davis", purpose: "Contract Discussion", status: "Signed In", checkIn: "10:30 AM" },
  { key: "2", name: "Jane Cooper", phone: "+234 802 345 6789", avatar: "https://i.pravatar.cc/40?img=47", host: "Emma Davis", purpose: "Contract Discussion", status: "Signed Off", checkIn: "10:30 AM" },
  { key: "3", name: "Guy Hawkins", phone: "+234 802 345 6789", avatar: "https://i.pravatar.cc/40?img=33", host: "Emma Davis", purpose: "Contract Discussion", status: "Pending", checkIn: "10:30 AM" },
  { key: "4", name: "Dianne Russell", phone: "+234 802 345 6789", avatar: "https://i.pravatar.cc/40?img=25", host: "Emma Davis", purpose: "Contract Discussion", status: "Rejected", checkIn: "10:30 AM" },
  { key: "5", name: "Robert Fox", phone: "+234 802 345 6789", avatar: "https://i.pravatar.cc/40?img=14", host: "Emma Davis", purpose: "Contract Discussion", status: "Signed In", checkIn: "10:30 AM" },
  { key: "6", name: "Jane Cooper", phone: "+234 802 345 6789", avatar: "https://i.pravatar.cc/40?img=29", host: "Emma Davis", purpose: "Contract Discussion", status: "Signed Off", checkIn: "10:30 AM" },
  { key: "7", name: "Guy Hawkins", phone: "+234 802 345 6789", avatar: "https://i.pravatar.cc/40?img=51", host: "Emma Davis", purpose: "Contract Discussion", status: "Pending", checkIn: "10:30 AM" },
  { key: "8", name: "Dianne Russell", phone: "+234 802 345 6789", avatar: "https://i.pravatar.cc/40?img=44", host: "Emma Davis", purpose: "Contract Discussion", status: "Rejected", checkIn: "10:30 AM" },
];

const filterTabs: FilterTab[] = ["All", "Signed In", "Signed Off", "Pending Approval", "Rejected"];

const columns: ColumnsType<VisitorRecord> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (_, record) => (
      <div className="flex items-center gap-3">
        <img src={record.avatar} alt={record.name} className="w-9 h-9 rounded-full object-cover" />
        <span className="text-sm font-medium text-slate-800">{record.name}</span>
      </div>
    ),
  },
  { title: "Phone No.", dataIndex: "phone", key: "phone", render: (phone) => <span className="text-sm text-slate-500">{phone}</span> },
  { title: "Host Name", dataIndex: "host", key: "host", render: (host) => <span className="text-sm text-slate-500">{host}</span> },
  { title: "Purpose", dataIndex: "purpose", key: "purpose", render: (purpose) => <span className="text-sm text-slate-500">{purpose}</span> },
  { title: "Check-In", dataIndex: "checkIn", key: "checkIn", render: (checkIn) => <span className="text-sm text-slate-500">{checkIn}</span> },
  { title: "Status", dataIndex: "status", key: "status", render: (status: VisitorStatus) => <StatusPill status={status} /> },
  {
    title: "Actions",
    key: "actions",
    align: "center",
    render: () => (
      <Button type="text" shape="circle" icon={<EyeOutlined />} aria-label="View visitor" className="bg-sky-50! text-sky-500! hover:bg-sky-100!" />
    ),
  },
];

export default function Visitors() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  return (
    <>
      <Header title="Visitors" />

      <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm shadow-slate-100">
          <div className="flex flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
            <div className="w-full overflow-x-auto rounded-lg border border-[#E6EAE8] bg-[#FAFAFA] p-1.5 sm:w-auto">
              <div className="flex min-w-max items-center gap-1">
                {filterTabs.map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <Button
                      key={tab}
                      type="text"
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-md! text-sm! font-medium! whitespace-nowrap ${
                        isActive
                          ? "bg-emerald-50! text-emerald-500! border! border-emerald-200!"
                          : "text-slate-400! hover:text-slate-600!"
                      }`}
                    >
                      {tab}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search visitors..."
                allowClear
                prefix={<SearchOutlined className="text-slate-300" />}
                className="w-full sm:w-56 rounded-lg"
              />
              <Button icon={<FilterOutlined />} aria-label="Filter" className="w-9! h-9! text-slate-400!" />
            </div>
          </div>

          <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
            <Table<VisitorRecord> columns={columns} dataSource={visitorData} pagination={false} rowKey="key" scroll={{ x: 900 }} className="visitor-table" />
          </div>

          <div className="flex flex-col gap-3 px-3 py-4 border-t border-slate-100 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-slate-400 text-center sm:text-left">Showing 1 to 8 of 1,248 entries</p>
            <Pagination current={page} pageSize={8} total={1248} onChange={setPage} showSizeChanger={false} className="text-center sm:text-right" />
          </div>
        </div>
      </main>
    </>
  );
}