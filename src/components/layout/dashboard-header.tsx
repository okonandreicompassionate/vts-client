import { Button, Dropdown, type MenuProps } from "antd";
import {
  DownOutlined,
  MenuOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { usePopup } from "@/features/popup/hooks/use-popup";
import { Spinner } from "@/components/ui/spinner";
import { ThemeToggle } from "../ui/theme-toggle";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { Avatar } from "../ui/avatar";
import EditProfileModal from "@/features/settings/components/modals/edit-profile-modal";
import SystemSettingsModal from "../../features/settings/components/modals/system-settings-modal";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";
import { useDashboardShell } from "./dashboard-shell-context";
import { formatRole } from "@/utils/format-role";

type DashboardHeaderProps = {
  title: string;
};

const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  const { data: profile, isLoading } = useAdminAuthSession();
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

  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <div>
          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            {displayName}
          </p>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
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
        <span className="inline-flex items-center gap-1 text-[11.5px]">
          <span
            aria-hidden="true"
            className="inline-block h-3.5 w-3.5 bg-current opacity-55"
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

    ...(profile?.role === "SUPERADMIN"
      ? [
          {
            key: "update-system-settings",
            label: (
              <span className="inline-flex items-center gap-1 text-[11.5px]">
                <SettingOutlined />
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
        <span className="inline-flex items-center gap-0.5 text-[11.5px]">
          <span
            aria-hidden="true"
            className="inline-block h-3.5 w-3.5 bg-current"
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
    <header className="sticky top-0 z-30 flex min-h-13 items-center justify-between border-b border-slate-100 bg-white/95 ps-2 pe-2 backdrop-blur dark:border-slate-700 dark:bg-slate-900 md:ps-5 md:pe-2">
      {/* Left side */}
      <div className="flex min-w-0 items-center">
        <Button
          type="text"
          onClick={() => shell?.setMobileOpen(true)}
          aria-label="Open navigation menu"
          icon={<MenuOutlined />}
          className="mr-1! flex! h-9! w-9! shrink-0! items-center! justify-center! p-0! text-slate-500! md:hidden! dark:text-slate-400!"
        />

        <h2 className="truncate text-lg font-bold text-slate-800 dark:text-slate-100">
          {title}
        </h2>
      </div>

      {/* Right side */}
      <div className="flex shrink-0 items-center gap-2">
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
              className="inline-flex cursor-pointer items-center gap-1 rounded-sm px-1 text-sm font-medium text-slate-800 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-900"
              aria-label={`Open account menu for ${displayName}`}
            >
              <Avatar
                name={displayName}
                size="sm"
                src={profile?.avatar}
              />

              <span className="hidden text-[13px] font-medium sm:block">
                {displayName}
              </span>

              <DownOutlined className="flex items-center text-[10px] text-slate-500 dark:text-slate-400" />
            </button>
          </Dropdown>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;