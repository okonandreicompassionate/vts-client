import { Dropdown, type MenuProps } from "antd";
import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { Spinner } from "@/components/ui/spinner";
import { ThemeToggle } from "../../../../components/ui/theme-toggle";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { Avatar } from "../../../../components/ui/avatar";
import EditProfileModal from "@/features/settings/components/modals/edit-profile-modal";
import SystemSettingsModal from "../../../../features/settings/components/modals/system-settings-modal";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";

const DashboardHeader = ({ title }: { title: string }) => {
const { data: profile, isLoading } = useAdminAuthSession();

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

  const displayName = profile?.fullName ?? profile?.email ?? "Admin User";

  const normalizedRole =
    profile?.role === "SUPERADMIN"
      ? "Super Admin"
      : (profile?.role
          ?.toLowerCase()
          .replace(/[_-]+/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .replace(/\b\w/g, (char) => char.toUpperCase()) ?? "Admin");

  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <div>
          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{displayName}</p>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">{normalizedRole}</p>
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
          <img src="/profile.svg" className="h-3.5 opacity-55 brightness-0" alt="" />
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
          <img src="/back.svg" className="h-3.5" alt="" />
          Logout
        </span>
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex min-h-13 items-center justify-between border-b border-slate-100 bg-white/95 ps-3 pe-1 backdrop-blur md:ps-6 md:pe-2 dark:border-slate-800 dark:bg-slate-950/95">
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h2>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        {isLoading ? (
          <div className="flex h-8 w-8 items-center justify-center">
            <Spinner variant="inline" />
          </div>
        ) : (
          <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={["click"]}>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1 rounded-sm px-1 text-sm font-medium text-slate-800 transition hover:bg-slate-50 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
            >
              <Avatar name={displayName} size="sm" src={profile?.avatar} />

              <span className="hidden text-[13px] font-medium sm:block">{displayName}</span>

              <DownOutlined className="flex items-center text-[10px] text-slate-500 dark:text-slate-400" />
            </button>
          </Dropdown>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
