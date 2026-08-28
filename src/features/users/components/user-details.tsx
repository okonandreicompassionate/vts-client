import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Alert, Button } from "antd";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardHeader from "@/components/layout/dashboard-header";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { useGetAdminByIdQuery } from "@/features/users/api/users-api-slice";

import { DeleteAdmin } from "../components/delete-admin-button";

function getErrorStatus(error: unknown): number | string | undefined {
  if (error && typeof error === "object" && "status" in error) {
    return (error as FetchBaseQueryError).status;
  }

  return undefined;
}

export default function UserDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

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
      {
        label: "Full Name",
        value: admin?.fullName ?? "-",
      },
      {
        label: "Email Address",
        value: admin?.email ?? "-",
      },
      {
        label: "Phone Number",
        value: admin?.phoneNumber ?? "-",
      },
      {
        label: "Role",
        value: admin?.role ?? "-",
      },
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
        <DashboardHeader title="Admin Details" />

        <main className="flex-1 px-2 pt-1 pb-3 sm:px-2 md:px-2 md:py-3">
          <Alert
            type="error"
            showIcon
            title="No admin ID was provided."
          />
        </main>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <DashboardHeader title="Admin Details" />

        <main className="flex flex-1 px-2 pt-1 pb-3 sm:px-2 md:px-2 md:py-3">
          <Spinner
            variant="page"
            label="Loading admin..."
          />
        </main>
      </>
    );
  }

  if (isError) {
    const status = getErrorStatus(error);

    if (status === 400) {
      return (
        <>
          <DashboardHeader title="Admin Details" />

          <main className="flex-1 px-2 pt-1 pb-3 sm:px-2 md:px-2 md:py-3">
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
          <DashboardHeader title="Admin Details" />

          <main className="flex-1 px-2 pt-1 pb-3 sm:px-2 md:px-2 md:py-3">
            {BackButton}

            <Alert
              type="error"
              showIcon
              title="Access denied"
              description="Only authorized users can view admin details."
            />
          </main>
        </>
      );
    }

    if (status === 404) {
      return (
        <>
          <DashboardHeader title="Admin Details" />

          <main className="flex-1 px-2 pt-1 pb-3 sm:px-2 md:px-2 md:py-3">
            {BackButton}

            <Alert
              type="warning"
              showIcon
              title="Admin not found"
              description="This user may not exist or may belong to another organization."
            />
          </main>
        </>
      );
    }

    return (
      <>
        <DashboardHeader title="Admin Details" />

        <main className="flex-1 px-2 pt-1 pb-3 sm:px-2 md:px-2 md:py-3">
          {BackButton}

          <Alert
            type="error"
            showIcon
            title="Something went wrong loading this admin."
            description="Please try again."
            action={
              <Button
                size="small"
                onClick={() => window.location.reload()}
              >
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
        <DashboardHeader title="Admin Details" />

        <main className="flex-1 px-2 pt-1 pb-3 sm:px-2 md:px-2 md:py-3">
          {BackButton}

          <Alert
            type="warning"
            showIcon
            title="Admin not found"
          />
        </main>
      </>
    );
  }

  const roleBadge =
    admin.role === "SUPERADMIN"
      ? "border border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-400"
      : "border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400";

  return (
    <>
      <DashboardHeader title="Admin Details" />

      <main className="flex-1 px-2 pt-1 pb-3 sm:px-2 md:px-2 md:py-3">
        <div className="mb-1">
          {BackButton}
        </div>

        <div className="w-full xl:flex xl:min-h-[calc(100vh-3.25rem)] xl:justify-center">
          <div className="flex min-w-0 flex-col gap-4 lg:flex-row xl:h-full xl:w-full xl:gap-8 2xl:gap-10">
            {/* Admin information */}
            <div className="w-full min-w-0 rounded-xl border border-slate-100 bg-white pt-2.5 px-4 shadow-sm shadow-slate-100 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:flex-1 xl:h-full xl:px-10 xl:py-8 2xl:px-12 2xl:py-10 dark:border-slate-800 dark:bg-slate-800 dark:shadow-none">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-2.5">
                  <Avatar
                    name={admin.fullName || admin.email}
                    size="md"
                  />
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

            {/* Access + actions */}
            <div className="w-full min-w-0 rounded-lg border border-slate-100 bg-white px-4 pt-3 shadow-sm shadow-slate-100 sm:px-6 sm:pt-6 lg:w-80 lg:shrink-0 xl:w-96 xl:px-6 xl:pt-6 2xl:w-104 dark:border-slate-800 dark:bg-slate-800 dark:shadow-none">
              <h3 className="mb-2.5 text-sm font-bold text-slate-800 dark:text-slate-100">
                Admin Access
              </h3>

              <div className="space-y-3">
                {[
                  {
                    key: "role",
                    title: "Role level",
                    value: admin.role,
                    status: "done-green",
                  },
                  {
                    key: "contact",
                    title: "Primary contact",
                    value: admin.email,
                    status: "done-orange",
                  },
                ].map((step, idx) => (
                  <div
                    key={step.key}
                    className="flex gap-2"
                  >
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] text-white ${
                          step.status === "done-green"
                            ? "bg-emerald-500"
                            : "bg-orange-400"
                        }`}
                      >
                        <CheckOutlined />
                      </span>

                      {idx !== 1 && (
                        <span className="w-px flex-1 bg-slate-100 dark:bg-slate-700" />
                      )}
                    </div>

                    <div>
                      <p className="text-xs leading-tight font-semibold text-slate-800 dark:text-slate-100">
                        {step.title}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {step.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Danger zone */}
              <div className="mt-2 flex flex-col xl:gap-5 border-t border-slate-100 pt-5 dark:border-slate-700 mb-4">
                <div className="flex flex-col xl:gap-2">
                  <p className="text-[13px]  font-semibold text-red-600 dark:text-red-400">
                    Danger Zone
                  </p>

                  <p className="text-xs xl:text-[12px] leading-relaxed text-slate-400 mb-2">
                    Remove this administrator and revoke their
                    administrative access to this organization.
                  </p>
                </div>

                <DeleteAdmin adminId={id} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
