import { Button } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  CloseOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { paths } from "../../config/paths";
import { useOrganization } from "@/features/organizations";
import { useGetProfileQuery } from "@/features/settings/api/settings-api-slice";
import { useTheme } from "@/features/theme/hooks/use-theme";
import type { Dispatch, SetStateAction } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
};

export default function Sidebar({
  collapsed,
  mobileOpen,
  setMobileOpen,
  setCollapsed,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { orgSlug } = useOrganization();
  const { isDark } = useTheme();

  const { data: profile } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const isSuperAdmin = profile?.role === "SUPERADMIN";

  const navItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      href: paths.admin.dashboard.getHref(orgSlug),
      icon: <AppstoreOutlined />,
    },
    {
      key: "visitors",
      label: "Visitors",
      href: paths.admin.visitors.getHref(orgSlug),
      icon: "/visitors.svg",
    },
    {
      key: "employees",
      label: "Employees",
      href: paths.admin.employees.getHref(orgSlug),
      icon: "/staff.svg",
    },
    ...(isSuperAdmin
      ? [
          {
            key: "Admins",
            label: "Admins",
            href: paths.admin.users.getHref(orgSlug),
            icon: <TeamOutlined />,
          },
        ]
      : []),
    {
      key: "settings",
      label: "Settings",
      href: paths.admin.settings.getHref(orgSlug),
      icon: <SettingOutlined />,
    },
  ];

  const go = (href: string) => {
    navigate(href);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-64 transform flex-col justify-between border-r border-slate-100 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-950 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:sticky md:top-0 md:h-screen md:translate-x-0 md:transition-all ${
          collapsed ? "md:w-20" : "md:w-60"
        } md:shrink-0`}
      >
        <div>
          <div className="flex h-16 items-center justify-between px-5">
            {!collapsed && (
              <img
                src="/logo.svg"
                className="h-3 border-0! shadow-none! outline-none! md:block"
                alt="Logo"
              />
            )}

            {/* Desktop collapse button */}
            <Button
              type="text"
              onClick={() => setCollapsed((c) => !c)}
              aria-label="Toggle sidebar"
              icon={
                <img
                  src={
                    collapsed
                      ? isDark
                        ? "/expand-dark.svg"
                        : "/expand.svg"
                      : isDark
                        ? "/collapse-dark.svg"
                        : "/collapse.svg"
                  }
                  alt=""
                  className="h-4 w-4"
                />
              }
              className="hidden! h-7! w-7! text-slate-400! md:inline-flex! dark:text-slate-500!"
            />

            {/* Mobile close button */}
            <Button
              type="text"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              icon={<CloseOutlined />}
              className="h-7! w-7! text-slate-400! md:hidden! dark:text-slate-500!"
            />
          </div>

          <TooltipProvider>
            <nav className="mt-1 space-y-1 px-3">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.href);

                const button = (
                  <Button
                    type="text"
                    onClick={() => go(item.href)}
                    className={`flex! h-auto! w-full! items-center rounded-lg! px-3! py-1.5! text-sm! font-medium! ${
                      isActive
                        ? "bg-sky-500! text-white! shadow-sm shadow-sky-200 dark:shadow-sky-900!"
                        : "text-slate-500! hover:bg-slate-50! dark:text-slate-400! dark:hover:bg-slate-800!"
                    } ${
                      collapsed
                        ? "md:justify-center!"
                        : "justify-start!"
                    }`}
                  >
                    <span className="text-sm">
                      {typeof item.icon === "string" ? (
                        <img
                          src={item.icon}
                          alt=""
                          className={`h-4 w-4 ${
                            isActive ? "brightness-0 invert" : ""
                          }`}
                        />
                      ) : (
                        item.icon
                      )}
                    </span>

                    <span
                      className={collapsed ? "md:hidden" : ""}
                    >
                      {item.label}
                    </span>
                  </Button>
                );

                return collapsed ? (
                  <Tooltip key={item.key}>
                    <TooltipTrigger asChild>
                      {button}
                    </TooltipTrigger>

                    <TooltipContent>
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <div key={item.key}>{button}</div>
                );
              })}
            </nav>
          </TooltipProvider>
        </div>
      </aside>
    </>
  );
}
