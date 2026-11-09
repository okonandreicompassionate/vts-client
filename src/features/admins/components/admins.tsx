import { useMemo, useState } from "react";

import { Button, Select } from "antd";
import { FileTextOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { useGetAdminsQuery } from "@/features/admins/api/admins-api-slice";

import type { Admin } from "../types/types";

import AddAdminModal from "./modals/add-admin-modal";
import AdminDetailsDrawer from "./admin-details-drawer";
import { usePopup } from "@/lib/contexts/popup/use-popup";

import { adminColumns } from "./admins-columns";
import { DataTableCard, FilterBar, PageShell, StatCards, RefreshButton } from "@/components/page";
import { useGetProfileQuery } from "@/lib/auth/profile-api";
import { adminManagementRoles } from "@/types/user-role";
import { useGenerateReport } from "@/hooks/use-generate-report";
import { formatRole } from "@/utils/format-role";

type RoleFilter = "ALL" | "SUPERADMIN" | "ADMIN";

export default function AdminsPage() {
  const { openModal, openDrawer } = usePopup();
  const { generateReport, isGeneratingReport } = useGenerateReport();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data: profile } = useGetProfileQuery();
  const canManageAdmins = profile ? adminManagementRoles.includes(profile.role) : false;


  const { data: admins = [], isLoading, isFetching, isError, refetch } = useGetAdminsQuery();

  const adminList: Admin[] = useMemo(
    () =>
      admins.map((admin) => ({
        id: admin.id,
        name: admin.fullName || admin.email,
        email: admin.email,
        role: admin.role,
        phoneNumber: admin.phoneNumber,
      })),
    [admins],
  );

  // The admin list is small and loaded in full, so search, filters and paging happen here.
  const filteredAdmins = useMemo(() => {
    const term = search.trim().toLowerCase();

    return adminList.filter(
      (admin) =>
        (roleFilter === "ALL" || admin.role === roleFilter) &&
        (!term ||
          admin.name.toLowerCase().includes(term) ||
          admin.email.toLowerCase().includes(term) ||
          admin.phoneNumber.includes(term)),
    );
  }, [adminList, roleFilter, search]);

  const pageRows = filteredAdmins.slice((page - 1) * pageSize, page * pageSize);

  const handleRowClick = (record: Admin) => {
    openDrawer(<AdminDetailsDrawer adminId={record.id} />);
  };

  const resetToFirstPage = () => setPage(1);

  // Every admin is already loaded, so the report uses the filtered list as is.
  const generateAdminReport = () =>
    generateReport({
      name: "admins",
      columns: [
        { header: "Name", value: (row) => row.name },
        { header: "Email", value: (row) => row.email },
        { header: "Phone", value: (row) => row.phoneNumber },
        { header: "Role", value: (row) => formatRole(row.role) },
      ],
      loadRows: () => filteredAdmins,
    });

  const superAdminCount = adminList.filter((admin) => admin.role === "SUPERADMIN").length;

  return (
    <PageShell
      fill
      title="Admins"
      description="People who can manage this organization's visitor system."
      actions={
        <>
          <RefreshButton loading={isFetching} onClick={() => void refetch()} />

          <Button
            icon={<FileTextOutlined />}
            loading={isGeneratingReport}
            onClick={() => void generateAdminReport()}
          >
            Generate Report
          </Button>

          {canManageAdmins && (
            <Button
              type="primary"
              onClick={() => openModal(<AddAdminModal />)}
              icon={
                <img src="/add-admins.svg" alt="" className="inline-flex h-3 w-3 items-center" />
              }
            >
              Invite Admin
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
            resetToFirstPage();
          },
          placeholder: "Search by name, email or phone",
        }}
      >
        <Select<RoleFilter>
          aria-label="Filter admins by role"
          value={roleFilter}
          onChange={(value) => {
            setRoleFilter(value);
            resetToFirstPage();
          }}
          options={[
            { label: "All roles", value: "ALL" },
            { label: "Super Admins", value: "SUPERADMIN" },
            { label: "Admins", value: "ADMIN" },
          ]}
        />
      </FilterBar>

      <StatCards<RoleFilter>
        activeKey={roleFilter}
        onSelect={(key) => {
          setRoleFilter(key);
          resetToFirstPage();
        }}
        items={[
          {
            key: "ALL",
            label: "All admins",
            value: adminList.length,
            icon: <TeamOutlined />,
            tone: "sky",
          },
          {
            key: "SUPERADMIN",
            label: "Super Admins",
            value: superAdminCount,
            icon: <UserOutlined />,
            tone: "violet",
          },
          {
            key: "ADMIN",
            label: "Admins",
            value: adminList.length - superAdminCount,
            icon: <UserOutlined />,
            tone: "emerald",
          },
        ]}
      />

      <DataTableCard<Admin>
        columns={adminColumns}
        dataSource={pageRows}
        rowKey="id"
        loading={isLoading}
        error={
          isError ? { message: "Unable to load admins.", onRetry: () => void refetch() } : null
        }
        empty={
          <>
            <p className="text-sm font-medium text-slate-600 dark:text-zinc-300">
              {adminList.length === 0 ? "No admins yet" : "No admins match your filters"}
            </p>
            {adminList.length === 0 && (
              <p className="max-w-55 text-xs text-slate-400 dark:text-zinc-500">
                Invite your first admin to get started.
              </p>
            )}
          </>
        }
        pagination={{
          page,
          pageSize,
          total: filteredAdmins.length,
          onChange: (nextPage, nextPageSize) => {
            setPage(nextPageSize === pageSize ? nextPage : 1);
            setPageSize(nextPageSize);
          },
        }}
        onRowClick={handleRowClick}
      />
    </PageShell>
  );
}
