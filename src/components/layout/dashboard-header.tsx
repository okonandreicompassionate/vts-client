import { Breadcrumb, Button, Dropdown, type MenuProps } from "antd";
import { DownOutlined, MenuOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { Spinner } from "@/components/ui/spinner";
import { ThemeToggle } from "../ui/theme-toggle";
import NotificationBell from "@/features/notifications/components/notification-bell";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { Avatar } from "../ui/avatar";
import EditProfileModal from "@/features/settings/components/modals/edit-profile-modal";
import SystemSettingsModal from "../../features/settings/components/modals/system-settings-modal";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";
import { adminManagementRoles } from "@/types/user-role";
import { useDashboardShell } from "./dashboard-shell-context";
import { formatRole } from "@/utils/format-role";
import { paths } from "@/config/paths";
import { useRouteBreadcrumb } from "@/lib/router/route-handle";

/** The staff top bar, rendered once by the dashboard layout. */
const DashboardHeader = () => {
  const { data: profile, isLoading } = useAdminAuthSession();
  const location = useLocation();
  const title = useRouteBreadcrumb();
  const shell = useDashboardShell();
  const { openModal } = usePopup();
  const logout = useLogout();

  const handleLogout = () => {
    logout();
  };

  const handleUpdateProfile = () => {
    openModal(<EditProfileModal />);
  };

  const handleUpdateSystemSettings = () => {
    openModal(<SystemSettingsModal />);
  };

  const displayName =
    profile?.fullName ?? profile?.email ?? "Admin User";

  const normalizedRole = formatRole(profile?.role);
  const isDashboard = location.pathname === paths.admin.dashboard.getHref();
  const breadcrumbItems = isDashboard
    ? [{ title: "Dashboard" }]
    : [
        { title: <Link to={paths.admin.dashboard.getHref()}>Dashboard</Link> },
        ...(title ? [{ title }] : []),
      ];

  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <div>
          <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
            {displayName}
          </p>

          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
            {normalizedRole}
          </p>
        </div>
      ),
      disabled: true,
    },

    {
      type: "divider",
    },

    {
      key: "update-profile",
      label: (
        <span className="inline-flex items-center gap-1 text-[11.5px] text-slate-700 dark:text-zinc-200">
          <span
            aria-hidden="true"
            className="inline-block h-3.5 w-3.5 shrink-0 bg-current"
            style={{
              WebkitMaskImage: "url(/profile.svg)",
              maskImage: "url(/profile.svg)",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              WebkitMaskSize: "contain",
              maskSize: "contain",
            }}
          />
          Update Profile
        </span>
      ),
      onClick: handleUpdateProfile,
    },

    ...(profile && adminManagementRoles.includes(profile.role)
      ? [
          {
            key: "update-system-settings",
            label: (
              <span className="inline-flex items-center gap-1 text-[11.5px] text-slate-700 dark:text-zinc-200">
                <span
                  aria-hidden="true"
                  className="inline-block h-3.5 w-3.5 shrink-0 bg-current"
                  style={{
                    WebkitMaskImage: "url(/settings.svg)",
                    maskImage: "url(/settings.svg)",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                  }}
                />
                Update System Settings
              </span>
            ),
            onClick: handleUpdateSystemSettings,
          },
        ]
      : []),

    {
      key: "logout",
      label: (
        <span className="inline-flex items-center gap-0.5 text-[11.5px] text-slate-700 dark:text-zinc-200">
          <span
            aria-hidden="true"
            className="inline-block h-3.5 w-3.5 shrink-0 bg-current"
            style={{
              WebkitMaskImage: "url(/back.svg)",
              maskImage: "url(/back.svg)",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              WebkitMaskSize: "contain",
              maskSize: "contain",
            }}
          />
          Logout
        </span>
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <header className="z-30 flex min-h-13 shrink-0 items-center justify-between border-b border-slate-100 bg-white/95 ps-2 pe-1 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900 md:ps-5 md:pe-2">
      {/* Left side */}
      <div className="flex min-w-0 items-center">
        <Button
          type="text"
          onClick={() => shell?.setMobileOpen(true)}
          aria-label="Open navigation menu"
          icon={<MenuOutlined />}
          className="mr-1! flex! h-9! w-9! shrink-0! items-center! justify-center! p-0! text-slate-500! md:hidden! dark:text-zinc-400!"
        />

        <Breadcrumb
          aria-label="Breadcrumb"
          items={breadcrumbItems}
          className="truncate text-base font-semibold text-slate-800 dark:text-zinc-100"
        />
      </div>

      {/* Right side */}
      <div className="flex shrink-0 items-center gap-2">
        <NotificationBell />
        <ThemeToggle />

        {isLoading ? (
          <div className="flex h-8 w-8 items-center justify-center">
            <Spinner variant="inline" />
          </div>
        ) : (
          <Dropdown
            menu={{ items: menuItems }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1 rounded-sm px-1 text-sm font-medium text-slate-800 transition hover:bg-slate-50 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-900"
              aria-label={`Open account menu for ${displayName}`}
            >
              <Avatar
                name={displayName}
                size="sm"
                src={profile?.avatar}
              />

              <span className="hidden flex-col text-left leading-tight sm:flex">
                <span className="text-[13px] font-medium">{displayName}</span>
                <span className="text-[11px] font-normal text-slate-500 dark:text-zinc-400">
                  {normalizedRole}
                </span>
              </span>

              <DownOutlined className="flex items-center text-[10px] text-slate-500 dark:text-zinc-400" />
            </button>
          </Dropdown>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;