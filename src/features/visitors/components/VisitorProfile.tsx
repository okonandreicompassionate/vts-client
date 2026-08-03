import { ArrowRight, Info } from "lucide-react";
import { Button, Tag } from "antd";
import { useMemo, useState, type JSX } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { paths } from "../../../config/paths";
import { useTenant } from "../../../lib/tenant";

type VisitorProfileStatus = "pending" | "approved" | "rejected";

type VisitorRegistration = {
  name: string;
  purposeOfVisit: string;
  hostName: string;
  department: string;
  phoneNo: string;
};

const defaultRegistration: VisitorRegistration = {
  name: "Visitor Name",
  purposeOfVisit: "Meeting",
  hostName: "Host Name",
  department: "Visitor Services",
  phoneNo: "+234 000 000 0000",
};

type StatusMeta = {
  title: string;
  subtitle: string;
  description: string;
  reason: string;
  pillLabel: string;
  pillClasses: string;
  badgeColor: string;
  bannerBg: string;
  iconWrapBg: string;
  icon: JSX.Element;
  desktopIcon: JSX.Element;
  actionLabel: string;
  secondaryLabel: string;
};

const statusMeta: Record<VisitorProfileStatus, StatusMeta> = {
  pending: {
    title: "Waiting for approval",
    subtitle: "Your request is now in review.",
    description:
      "Please wait while the admin reviews your visitor access request. You will be notified when a decision is made.",
    reason: "",
    pillLabel: "Pending Approval",
    pillClasses: "border-[#F5A623]/60 text-[#F5A623]",
    badgeColor: "bg-orange-50 text-orange-600",
    bannerBg: "bg-orange-50/70 border-orange-100",
    iconWrapBg: "bg-white",
    icon: <img src="/pending.svg" alt="Pending" loading="lazy" className="h-26 w-26" />,
    desktopIcon: <img src="/pending.svg" alt="Pending" loading="lazy" className="h-16 w-16" />,
    actionLabel: "Proceed to Check-In",
    secondaryLabel: "Download Pass",
  },
  approved: {
    title: "Access approved",
    subtitle: "You're good to go.",
    description:
      "Your visitor request has been approved. Please present this profile page at reception when you arrive.",
    reason: "",
    pillLabel: "Visit Approved",
    pillClasses: "border-emerald-400/60 text-emerald-500",
    badgeColor: "bg-emerald-50 text-emerald-600",
    bannerBg: "bg-emerald-50/70 border-emerald-100",
    iconWrapBg: "bg-white",
    icon: <img src="/approved.svg" alt="Approved" className="h-26 w-26" />,
    desktopIcon: <img src="/approved.svg" alt="Approved" className="h-16 w-16" />,
    actionLabel: "Proceed to Check-In",
    secondaryLabel: "Download Pass",
  },
  rejected: {
    title: "Request declined",
    subtitle: "Your request was not approved.",
    description:
      "The administrator did not approve this visit. You can resubmit your request with updated details or contact your host for clarification.",
    reason: "The host is unavailable today.",
    pillLabel: "Visit Declined",
    pillClasses: "border-rose-400/60 text-rose-500",
    badgeColor: "bg-rose-50 text-rose-600",
    bannerBg: "bg-rose-50/70 border-rose-100",
    iconWrapBg: "bg-white",
    icon: <img src="/rejected.svg" alt="Rejected" className="h-26 w-26" />,
    desktopIcon: <img src="/rejected.svg" alt="Rejected" className="h-16 w-16" />,
    actionLabel: "Register Again",
    secondaryLabel: "Contact Reception",
  },
};

export default function VisitorProfile() {
  const { orgSlug } = useTenant();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [statusOverride, setStatusOverride] = useState<VisitorProfileStatus | null>(null);
  const isDev = Boolean(import.meta.env?.DEV);

  const statusParam = searchParams.get("status") as VisitorProfileStatus | null;

  const status = useMemo<VisitorProfileStatus>(() => {
    if (statusOverride) return statusOverride;
    if (statusParam === "approved" || statusParam === "rejected") return statusParam;
    return "pending";
  }, [statusOverride, statusParam]);

  const registration = useMemo<VisitorRegistration>(() => {
    if (typeof window === "undefined") return defaultRegistration;
    const stored = window.localStorage.getItem("visitorRegistration");
    if (!stored) return defaultRegistration;
    try {
      return JSON.parse(stored) as VisitorRegistration;
    } catch {
      return defaultRegistration;
    }
  }, []);

  const meta = statusMeta[status];
  const isPending = status === "pending";

  const requestId = `#VT-${status === "approved" ? "A1001" : status === "rejected" ? "R1002" : "P1003"}`;

  const actionPath = (() => {
    switch (status) {
      case "approved":
        return paths.home.getHref(orgSlug);
      case "rejected":
        return paths.register.getHref(orgSlug);
      default:
        return paths.home.getHref(orgSlug);
    }
  })();

  return (
    <>
      {isDev && (
        <div className="fixed right-3 bottom-3 z-50 flex gap-1 rounded-full bg-slate-900/90 p-1 text-xs text-white shadow-lg">
          {(["pending", "approved", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusOverride(s)}
              className={`rounded-full px-3 py-1.5 capitalize transition ${
                status === s ? "bg-sky-500" : "hover:bg-white/10"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* ===================== MOBILE LAYOUT ===================== */}
      <div className="relative flex min-h-screen flex-col bg-white px-6 pt-16 pb-6 md:hidden">
        {isPending && <div className="absolute inset-0 z-10 bg-white/50" />}

        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 items-center justify-center">{meta.icon}</div>

          <span
            className={`mt-17 inline-flex items-center rounded-full border px-6 py-2 text-[15px] font-semibold ${meta.pillClasses}`}
          >
            {meta.pillLabel}
          </span>

          {status === "rejected" ? (
            <div className="mt-9 w-full rounded-2xl border border-slate-100 p-4 text-left">
              <p className="text-xs font-medium text-slate-400">Reason for refusal</p>
              <div className="mt-2.5 flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} />
                <p className="text-[15px] leading-snug font-semibold text-slate-800">
                  {meta.reason}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-9 w-full rounded-2xl border border-slate-100 p-5 text-left">
              <p className="text-[19px] font-bold text-slate-900">{registration.name}</p>
              <p className="mt-1 text-sm text-slate-400">ID: {requestId}</p>

              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                    Host
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{registration.hostName}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                    Department
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{registration.department}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                    Date
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">Oct 24, 2023</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                    Time
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">10:30 AM</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                    Phone No
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{registration.phoneNo}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                    Badge Number
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">B-402</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                    Purpose of Visit
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {registration.purposeOfVisit}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="-mt-[690px] flex-1" />

        <div className="mt-8 space-y-3">
          <Button
            type="primary"
            block
            size="large"
            disabled={isPending}
            className="h-12! rounded-xl! bg-sky-400! text-[15px]! font-semibold hover:bg-sky-500! disabled:opacity-50!"
            onClick={() => navigate(actionPath)}
          >
            {meta.actionLabel}
          </Button>
          <Button
            block
            size="large"
            disabled={isPending}
            className="h-12! rounded-xl! border-slate-200! text-[15px]! font-semibold text-sky-500! disabled:opacity-50!"
          >
            {meta.secondaryLabel}
          </Button>
        </div>
      </div>

 
      <div className="relative hidden min-h-screen flex-col justify-center bg-white px-6 py-6 md:flex lg:px-10">
        {isPending && <div className="absolute inset-0 z-10 bg-white/70" />}

        <div className="mx-auto w-full max-w-xl">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] text-slate-400 uppercase">
                Visitor profile
              </p>
              <h1 className="mt-1 text-xl font-bold text-slate-900">Your request status</h1>
            </div>
            <Tag
              className="rounded-full border-0! px-4 py-1.5 text-sm font-semibold"
              color={
                meta.badgeColor === "bg-orange-50 text-orange-600"
                  ? "orange"
                  : meta.badgeColor === "bg-emerald-50 text-emerald-600"
                    ? "green"
                    : "red"
              }
            >
              {status === "pending"
                ? "Pending approval"
                : status === "approved"
                  ? "Approved"
                  : "Rejected"}
            </Tag>
          </div>

          {/* Status banner */}
          <div
            className={`flex items-center gap-3 rounded-2xl border p-4 shadow-sm ${meta.bannerBg}`}
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-sm ${meta.iconWrapBg}`}
            >
              {meta.desktopIcon}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{meta.title}</p>
              <p className="mt-0.5 text-xs text-slate-600">{meta.description}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {/* Visitor details card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <span className="text-base font-bold">{registration.name.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-slate-900">{registration.name}</p>
                  <p className="mt-0.5 text-xs text-slate-400">Request {requestId}</p>
                </div>
              </div>

              {status === "rejected" && meta.reason && (
                <div className="mt-4 flex items-start gap-3 rounded-xl bg-rose-50 p-3">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" strokeWidth={2} />
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-rose-400 uppercase">
                      Reason for refusal
                    </p>
                    <p className="mt-1 text-sm font-semibold text-rose-700">{meta.reason}</p>
                  </div>
                </div>
              )}

              <div className="mt-4 divide-y divide-slate-100">
                {[
                  { label: "Purpose of Visit", value: registration.purposeOfVisit },
                  { label: "Host", value: registration.hostName },
                  { label: "Department", value: registration.department },
                  { label: "Phone Number", value: registration.phoneNo },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-4 py-2 first:pt-0 last:pb-0"
                  >
                    <span className="shrink-0 text-sm text-slate-500">{row.label}</span>
                    <span className="truncate text-right text-sm font-semibold text-slate-900">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-900">Timeline</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-500">Submitted</p>
                  <p className="text-sm font-semibold text-slate-800">Just now</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-500">Review by</p>
                  <p className="text-sm font-semibold text-slate-800">Your host</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-500">Request ID</p>
                  <p className="truncate text-sm font-semibold text-slate-800">{requestId}</p>
                </div>
              </div>
            </div>

            
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-3 text-sm font-bold text-slate-900">Next steps</p>
              <Button
                type="primary"
                block
                size="large"
                disabled={isPending}
                className="h-10! rounded-xl! font-semibold disabled:opacity-50!"
                icon={<ArrowRight size={18} />}
                iconPlacement="end"
                onClick={() => navigate(actionPath)}
              >
                {meta.actionLabel}
              </Button>
              <Button
                block
                size="large"
                disabled={isPending}
                className="mt-2 h-10! rounded-xl! font-semibold disabled:opacity-50!"
              >
                {meta.secondaryLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}