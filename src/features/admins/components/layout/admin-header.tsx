import { Dropdown, type MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Spinner } from "@/components/spinner";
import { ThemeToggle } from "../../../../components/theme-toggle";
import { useGetProfileQuery } from "../../api/admin-api-slice";
import { useLogout } from "../../hooks/use-logout";
import { VisitorAvatar } from "../visitor-avatar";

const AdminHeader = ({ title }: { title: string }) => {
  const { data: profile, isLoading } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const logout = useLogout();

  const handleLogout = () => {
    logout();
  };

  const displayName = profile?.fullName ?? profile?.email ?? "Admin User";
  const role = profile?.role ?? "Admin";

  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <div className="-py-1">
          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            {displayName}
          </p>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {role}
          </p>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: (
        <span className="inline-flex text-[11.5px] items-center gap-0.5">
          <img src="/back.svg" className="h-3.5" alt="Logout" />
          Logout
        </span>
      ),
      onClick: handleLogout,
    },
     {
      key: "update-profile",
      label: (
        <span className="inline-flex text-[11.5px] items-center gap-1">
          <img src="/profile.svg" className="h-3.5" alt="Logout" />
          Update Profile
        </span>
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur md:px-8 dark:border-slate-800 dark:bg-slate-950/95">
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
        {title}
      </h2>

      <div className="flex items-center gap-2">
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
              className="inline-flex items-center gap-1 rounded-sm px-1 text-sm font-medium text-slate-800 transition hover:bg-slate-50 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
            >
              <VisitorAvatar
                name={displayName}
                size="sm"
                src={profile?.avatar}
              />

              <span className="hidden text-sm font-medium sm:block">
                {displayName}
              </span>

              <DownOutlined className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center" />
            </button>
          </Dropdown>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;