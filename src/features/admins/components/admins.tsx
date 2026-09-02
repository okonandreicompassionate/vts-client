import { useState } from "react";

import { Button, Drawer, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";

import TableComponent from "@/components/ui/table";

import {
  useBulkDeactivateAdminsMutation,
  useGetAdminsQuery,
} from "@/features/admins/api/admins-api-slice";

import { Spinner } from "@/components/ui/spinner";

import type { AdminItem } from "@/features/admins/types/api-types";
import type { Admin } from "../types/types";

import AddAdminModal from "./modals/add-admin-modal";
import AdminDetails from "./admin-details";

import { useAdminsSSE } from "../hooks/use-admins-sse";
import { adminColumns } from "./admins-columns";
import { getSelectionColumn } from "@/components/ui/selection-column";
import DashboardHeader from "@/components/layout/dashboard-header";

export default function AdminsPage() {
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Admin[]>([]);

  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);

  useAdminsSSE();

  const {
    data: admins = [],
    isLoading,
    isError,
    refetch,
  } = useGetAdminsQuery();

  const [deactivateAdmins, { isLoading: isDeactivating }] =
    useBulkDeactivateAdminsMutation();

  const adminList: Admin[] = admins.map((admin: AdminItem) => ({
    id: admin.id,
    name: admin.fullName || admin.email,
    email: admin.email,
    role: admin.role,
    phoneNumber: admin.phoneNumber,
  }));

  const selectedRowKeys = selectedRows.map((row) => row.id);

  const allSelected =
    adminList.length > 0 && selectedRows.length === adminList.length;

  const handleToggleSelection = (record: Admin) => {
    setSelectedRows((current) =>
      current.some((row) => row.id === record.id)
        ? current.filter((row) => row.id !== record.id)
        : [...current, record],
    );
  };

  const handleToggleSelectAll = () => {
    setSelectedRows(allSelected ? [] : adminList);
  };

  const handleStartSelecting = () => {
    setIsSelecting(true);
  };

  const handleCancelSelecting = () => {
    setSelectedRows([]);
    setIsSelecting(false);
  };

  const handleDeactivateSelected = () => {
    const count = selectedRows.length;

    Modal.confirm({
      title: `Deactivate ${count} ${count === 1 ? "admin" : "admins"}?`,
      content:
        "This action cannot be undone. Selected admins will lose access immediately.",
      okText: "Deactivate",
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        try {
          await deactivateAdmins({ ids: selectedRowKeys }).unwrap();

          message.success(
            count === 1 ? "Admin deactivated" : "Admins deactivated",
          );

          setSelectedRows([]);
          setIsSelecting(false);
        } catch {
          message.error("Failed to deactivate selected admins");
        }
      },
    });
  };

  const columns: ColumnsType<Admin> = isSelecting
    ? [
        getSelectionColumn<Admin>({
          selectedRowKeys,
          onToggle: handleToggleSelection,
          checkboxClassName: "admins-table-checkbox",
        }),
        ...adminColumns,
      ]
    : adminColumns;

  const handleRowClick = (record: Admin) => {
    if (isSelecting) {
      handleToggleSelection(record);
      return;
    }

    setSelectedAdminId(record.id);
  };

  const handleCloseDetails = () => {
    setSelectedAdminId(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <DashboardHeader title="Admins" />

      <div className="flex min-h-12.5 items-center justify-between border-b border-slate-200 px-3 py-1 sm:py-2 dark:border-slate-800">
        <div className="flex min-w-0 items-center gap-2.5">
          {!isLoading && !isError && !isSelecting && (
            <>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {adminList.length} {adminList.length === 1 ? "admin" : "admins"}
              </span>

              <button
                type="button"
                onClick={handleStartSelecting}
                className="flex h-6! cursor-pointer items-center justify-center rounded-sm bg-sky-500 px-2 text-xs leading-none font-medium text-white transition-colors hover:bg-sky-600 active:bg-sky-700"
              >
                Select
              </button>
            </>
          )}

          {isSelecting && (
            <div className="flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-1.5 dark:border-slate-700 dark:bg-slate-800/60">
              <span className="flex h-7 items-center px-1 text-xs leading-none font-medium text-slate-700 dark:text-slate-200">
                {selectedRows.length} selected
              </span>

              <span className="h-4 w-px shrink-0 bg-slate-300 dark:bg-slate-600" />

              <button
                type="button"
                onClick={handleToggleSelectAll}
                className="flex h-7 cursor-pointer items-center justify-center rounded px-1.5 text-xs leading-none font-medium text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              >
                {allSelected ? "Clear all" : "Select all"}
              </button>

              <button
                type="button"
                onClick={handleCancelSelecting}
                className="flex h-7 cursor-pointer items-center justify-center rounded px-1.5 text-xs leading-none font-medium text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  selectedRows.length === 0 || isDeactivating
                }
                onClick={handleDeactivateSelected}
                className="flex h-7 cursor-pointer items-center justify-center rounded px-1.5 text-xs leading-none font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
              >
                {isDeactivating ? "Deactivating…" : "Deactivate"}
              </button>
            </div>
          )}

          {isError && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-500">
                Unable to load admins
              </span>

              <button
                type="button"
                onClick={() => refetch()}
                className="text-xs font-medium text-sky-600 hover:underline dark:text-sky-400"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {!isSelecting && (
          <Button
            size="small"
            type="primary"
            className="flex h-7 gap-1 rounded-sm! text-xs"
            onClick={() => setInviteModalOpen(true)}
          >
            <img
              src="/add-admins.svg"
              alt=""
              className="inline-flex h-3 w-3 items-center"
            />

            <span className="text-xs">Invite Admin</span>
          </Button>
        )}
      </div>

      <div className="relative min-h-0 px-3 py-3">
        {!isLoading && !isError && adminList.length === 0 ? (
          <div className="flex h-56 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-200 text-center dark:border-slate-800">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              No admins yet
            </span>

            <span className="max-w-55 text-xs text-slate-400 dark:text-slate-500">
              Invite your first admin to get started.
            </span>

            <Button
              size="small"
              className="h-6!"
              type="primary"
              onClick={() => setInviteModalOpen(true)}
            >
              Invite Admin
            </Button>
          </div>
        ) : (
          <TableComponent<Admin>
            columns={columns}
            dataSource={adminList}
            rowKey="id"
            showSerialNumber
            serialNumberTitle="SN"
            onRow={(record) => ({
              onClick: () => handleRowClick(record),

              onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleRowClick(record);
                }
              },

              tabIndex: 0,
              role: "button",

              style: {
                cursor: "pointer",
              },
            })}
          />
        )}

        {isLoading && (
          <Spinner
            variant="inline"
            overlay
            className="bg-white/150 backdrop-blur-[1px] dark:bg-slate-900/70"
          />
        )}
      </div>

      <AddAdminModal
        open={isInviteModalOpen}
        onCancel={() => setInviteModalOpen(false)}
      />

      {/* Admin Details Drawer */}
      <Drawer
        title="Admin Details"
        placement="right"
        width={420}
        open={Boolean(selectedAdminId)}
        onClose={handleCloseDetails}
        destroyOnHidden
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        {selectedAdminId && (
          <AdminDetails
            adminId={selectedAdminId}
            onClose={handleCloseDetails}
          />
        )}
      </Drawer>
    </div>
  );
}