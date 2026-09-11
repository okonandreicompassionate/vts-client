import { Button } from "antd";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Settings,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  setCollapsed: (value: boolean) => void;
  setMobileOpen: (value: boolean) => void;
};

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/visitors", label: "Visitors", icon: UserCheck },
  { to: "/admin/employees", label: "Employees", icon: Users },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const Sidebar = ({
  collapsed,
  mobileOpen,
  setCollapsed,
  setMobileOpen,
}: SidebarProps) => {
  const isMobileOpen = mobileOpen;
  const { data: profile } = useAdminAuthSession();
  const visibleNavItems =
    profile?.role === "SUPERADMIN"
      ? [...navItems, { to: "/admin/users", label: "Admins", icon: Users }]
      : navItems;

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
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white transition-all duration-200 dark:border-slate-700 dark:bg-slate-950 md:static",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed ? "w-20" : "w-72",
          !collapsed && "md:w-72",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-3 py-4 dark:border-slate-700">
          <div className="flex min-w-0 items-center gap-2 overflow-hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 font-bold text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
              V
            </div>

            {!collapsed && (
              <div className="overflow-hidden">
                <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-50">
                  VTS
                </p>
                <p className="truncate text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Admin
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

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {visibleNavItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin/dashboard"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                  collapsed ? "justify-center px-2" : "",
                ].join(" ")
              }
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;