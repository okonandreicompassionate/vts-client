import { Button } from "antd";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CircleHelp,
  LayoutDashboard,
  ScanLine,
  Settings,
  UserCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";
import { useOrganization } from "@/features/organizations";
import { paths } from "@/config/paths";
import type { UserRole } from "@/types/user-role";

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  setCollapsed: (value: boolean) => void;
  setMobileOpen: (value: boolean) => void;
};

type SidebarNavItem =
  | { to: string; label: string; icon: LucideIcon }
  | { label: string; icon: LucideIcon; disabled: true };

const Sidebar = ({ collapsed, mobileOpen, setCollapsed, setMobileOpen }: SidebarProps) => {
  const isMobileOpen = mobileOpen;
  const { orgSlug } = useOrganization();
  const { data: profile } = useAdminAuthSession();
  const appointmentsItem: SidebarNavItem = {
    to: paths.admin.appointments.getHref(orgSlug),
    label: "Appointments",
    icon: CalendarDays,
  };
  const checkInsItem: SidebarNavItem = {
    to: paths.admin.checkIns.getHref(orgSlug),
    label: "Check-ins",
    icon: ScanLine,
  };
  const visitorsItem: SidebarNavItem = {
    to: paths.admin.visitors.getHref(orgSlug),
    label: "Visitors",
    icon: UserCheck,
  };
  const dashboardItem: SidebarNavItem = {
    to: paths.admin.dashboard.getHref(orgSlug),
    label: "Dashboard",
    icon: LayoutDashboard,
  };
  const facilityNavItems: SidebarNavItem[] = [
    dashboardItem,
    appointmentsItem,
    visitorsItem,
    checkInsItem,
    { to: paths.admin.settings.getHref(orgSlug), label: "Settings", icon: Settings },
    { label: "Help Center", icon: CircleHelp, disabled: true },
  ];
  const adminNavItems: SidebarNavItem[] = [
    ...facilityNavItems,
    { to: paths.admin.employees.getHref(orgSlug), label: "Employees", icon: Users },
    { to: paths.admin.users.getHref(orgSlug), label: "Admins", icon: Users },
  ];
  const navItemsByRole: Record<UserRole, SidebarNavItem[]> = {
    FACILITY: adminNavItems,
    SECURITY: [dashboardItem, appointmentsItem, visitorsItem, checkInsItem],
    FRONTDESK: [dashboardItem, appointmentsItem, visitorsItem, checkInsItem],
    ADMIN: adminNavItems,
    HOST: [appointmentsItem],
  };
  const visibleNavItems = profile ? navItemsByRole[profile.role] : [];

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
        >
          <span className="sr-only">Close sidebar</span>
        </button>
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white transition-all duration-200 md:sticky md:top-0 md:h-screen md:shrink-0 md:self-start dark:border-slate-700 dark:bg-slate-950",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed ? "w-20" : "w-64",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-3 py-3 dark:border-slate-700">
          <div className="flex min-w-0 items-center gap-2 overflow-hidden">
            <img
              src="/logo.png"
              alt="VisitorX"
              className={`h-auto shrink-0 object-contain ${collapsed ? "w-10" : "w-28"}`}
            />

            {!collapsed && (
              <div className="overflow-hidden">
                <p className="truncate text-[10px] tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                  {profile?.role === "FRONTDESK"
                    ? "Frontdesk"
                    : profile?.role
                      ? profile.role.charAt(0) + profile.role.slice(1).toLowerCase()
                      : "Admin"}
                </p>
              </div>
            )}
          </div>

          <Button
            type="text"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed(!collapsed)}
            className="hidden h-8 w-8 md:flex"
            icon={collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          />

          <Button
            type="text"
            aria-label="Close mobile navigation"
            onClick={() => setMobileOpen(false)}
            className="md:hidden"
            icon={<X size={16} />}
          />
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-2.5">
          {visibleNavItems.map((item) => {
            const { label, icon: Icon } = item;
            const className =
              "flex items-center gap-2.5 rounded-lg border border-transparent px-2.5 py-2.5 text-sm font-medium";
            const collapsedClassName = collapsed ? "justify-center px-2" : "";

            if ("disabled" in item) {
              return (
                <span
                  key={label}
                  aria-disabled="true"
                  title={`${label} is coming soon`}
                  className={[
                    className,
                    collapsedClassName,
                    "cursor-not-allowed text-slate-400 dark:text-slate-500",
                  ].join(" ")}
                >
                  <Icon size={18} />
                  {!collapsed && <span>{label}</span>}
                </span>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === paths.admin.dashboard.getHref(orgSlug)}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  [
                    className,
                    collapsedClassName,
                    isActive
                      ? "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-300"
                      : "text-slate-600 transition-colors hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                  ].join(" ")
                }
              >
                <Icon size={18} />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
