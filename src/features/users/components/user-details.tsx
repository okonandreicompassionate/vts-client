import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Alert, Button } from "antd";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminHeader from "@/app/routes/admin/layout/dashboard-header";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { useGetAdminByIdQuery } from "@/features/users/api/users-api-slice";
// import { useTenant } from "@/lib/tenant";

function getErrorStatus(error: unknown): number | string | undefined {
  if (error && typeof error === "object" && "status" in error) {
    return (error as FetchBaseQueryError).status;
  }

  return undefined;
}

export default function UserDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  // const { orgSlug } = useTenant();

  const {
    data: admin,
    isLoading,
    isError,
    error,
  } = useGetAdminByIdQuery(id ?? "", {
    skip: !id,
  });

  const detailRows = useMemo(
    () => [
      { label: "Full Name", value: admin?.fullName ?? "-" },
      { label: "Email Address", value: admin?.email ?? "-" },
      { label: "Phone Number", value: admin?.phoneNumber ?? "-" },
      { label: "Role", value: admin?.role ?? "-" },
    ],
    [admin],
  );

  const BackButton = (
    <Button
      type="link"
      icon={<ArrowLeftOutlined className="text-xs" />}
      className="mb-1px-0! font-medium text-sky-500!"
      onClick={() => navigate(-1)}
    >
      Back to List
    </Button>
  );

  if (!id) {
    return (
      <>
        <AdminHeader title="Admin Details" />
        <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
          <Alert type="error" showIcon title="No admin ID was provided." />
        </main>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <AdminHeader title="Admin Details" />
        <main className="flex flex-1 px-3 py-16">
          <Spinner variant="page" label="Loading admin..." />
        </main>
      </>
    );
  }

  if (isError) {
    const status = getErrorStatus(error);

    if (status === 400) {
      return (
        <>
          <AdminHeader title="Admin Details" />
          <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
            {BackButton}
            <Alert
              type="error"
              showIcon
              title="Invalid admin ID"
              description="The user ID provided is not valid."
            />
          </main>
        </>
      );
    }

    if (status === 403) {
      return (
        <>
          <AdminHeader title="Admin Details" />
          <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
            {BackButton}
            <Alert
              type="error"
              showIcon
              title="Access denied"
              description="Only SUPERADMIN users can view admin details."
            />
          </main>
        </>
      );
    }

    if (status === 404) {
      return (
        <>
          <AdminHeader title="Admin Details" />
          <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
            {BackButton}
            <Alert
              type="warning"
              showIcon
              title="Admin not found"
              description="This admin may not exist, may not be an admin-tier user, or may belong to another organization."
            />
          </main>
        </>
      );
    }

    return (
      <>
        <AdminHeader title="Admin Details" />
        <main className="flex-1 px-3 pt-2 pb-3 sm:px-4 md:px-8 md:py-4">
          {BackButton}
          <Alert
            type="error"
            showIcon
            title="Something went wrong loading this admin."
            description="Please try again."
            action={
              <Button size="small" onClick={() => window.location.reload()}>
                Retry
              </Button>
            }
          />
        </main>
      </>
    );
  }

  if (!admin) {
    return (
      <>
        <AdminHeader title="Admin Details" />
        <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
          {BackButton}
          <Alert type="warning" showIcon title="Admin not found" />
        </main>
      </>
    );
  }

  const roleBadge =
    admin.role === "SUPERADMIN"
      ? "bg-violet-50 text-violet-600 border border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800"
      : "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800";

  return (
    <>
      <AdminHeader title="Admin Details" />

      <main className="w-full flex-1 px-3 sm:px-4 md:py-2 xl:px-8 2xl:px-20">
        {BackButton}

        <div className="w-full xl:flex xl:min-h-[calc(100vh-3.25rem)] xl:justify-center">
          <div className="flex min-w-0 flex-col lg:flex-row xl:h-full xl:w-full xl:gap-8 2xl:gap-10">
            <div className="w-full min-w-0 rounded-xl border border-slate-100 bg-white px-4 shadow-sm shadow-slate-100 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:flex-1 xl:h-full xl:px-10 xl:py-8 2xl:px-12 2xl:py-10 dark:border-slate-800 dark:bg-slate-800 dark:shadow-none">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-2.5">
                  <Avatar name={admin.fullName || admin.email} size="md" />
                </div>

                <h3 className="text-md font-bold text-slate-800 xl:text-lg dark:text-slate-100">
                  {admin.fullName || admin.email}
                </h3>

                <span
                  className={`mt-1 inline-flex items-center rounded-full px-3 py-0.5 text-xs ${roleBadge}`}
                >
                  {admin.role}
                </span>
              </div>

              <div className="overflow-hidden rounded-lg border border-slate-100 dark:border-slate-700">
                {detailRows.map((row, idx) => (
                  <div
                    key={row.label}
                    className={`flex min-w-0 flex-col gap-1 px-4 py-2.5 sm:flex-row sm:items-center sm:px-5 xl:gap-0 xl:px-6 xl:py-3 xl:ps-10 ${
                      idx !== detailRows.length - 1
                        ? "border-b border-slate-100 dark:border-slate-700"
                        : ""
                    }`}
                  >
                    <span className="w-full shrink-0 text-xs text-slate-400 sm:w-40 xl:w-44">
                      {row.label}
                    </span>

                    <span className="min-w-0 text-xs wrap-break-word text-slate-700 dark:text-slate-200">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full min-w-0 rounded-lg border border-slate-100 bg-white px-4 py-3 shadow-sm shadow-slate-100 sm:px-6 sm:py-6 lg:w-80 lg:shrink-0 xl:w-96 xl:px-6 xl:py-6 2xl:w-104 dark:border-slate-800 dark:bg-slate-800 dark:shadow-none">
              <h3 className="mb-2.5 text-sm font-bold text-slate-800 dark:text-slate-100">
                Admin Access
              </h3>

              <div className="space-y-3">
                {[

                  { key: "2", title: "Role level", time: admin.role, status: "done-green" },
                  { key: "3", title: "Primary contact", time: admin.email, status: "done-orange" },
                ].map((step, idx) => (
                  <div key={step.key} className="flex gap-2">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] text-white ${
                          step.status === "done-blue"
                            ? "bg-sky-500"
                            : step.status === "done-green"
                              ? "bg-emerald-500"
                              : "bg-orange-400"
                        }`}
                      >
                        <CheckOutlined />
                      </span>

                      {idx !== 2 && <span className="w-px flex-1 bg-slate-100 dark:bg-slate-700" />}
                    </div>

                    <div>
                      <p className="text-xs leading-tight font-semibold text-slate-800 dark:text-slate-100">
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>

             

            </div>
          </div>
        </div>
      </main>
    </>
  );
}
