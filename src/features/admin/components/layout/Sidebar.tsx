import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "antd";
import { AppstoreOutlined, SettingOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { paths } from "../../../../config/paths"; // adjust depth to your structure

const navItems = [
  { key: "dashboard", label: "Dashboard", path: paths.admin.dashboard.path, getHref: paths.admin.dashboard.getHref, icon: <img src="dashboard.svg" alt="" />, fallbackIcon: <AppstoreOutlined /> },
  { key: "visitors", label: "Visitors", path: paths.admin.visitors.path, getHref: paths.admin.visitors.getHref, icon: <img src="visitors.svg" alt="" />, fallbackIcon: <AppstoreOutlined /> },
  { key: "settings", label: "Settings", path: paths.admin.settings.path, getHref: paths.admin.settings.getHref, icon: <SettingOutlined />, fallbackIcon: <SettingOutlined /> },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const go = (href: string) => {
    navigate(href);
    setMobileOpen(false);
  };

  return (
    <>
      <div className="md:hidden h-14 flex items-center justify-between px-4 bg-white border-b border-slate-100">
        <img src="/logo.svg" alt="Logo" className="h-3" />
        <Button type="text" onClick={() => setMobileOpen(true)} aria-label="Open menu" icon={<MenuOutlined className="text-lg" />} className="w-9! h-9! text-slate-500!" />
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}

      <aside
        className={`
          bg-white border-r border-slate-100 flex flex-col justify-between
          fixed inset-y-0 left-0 z-50 w-[85vw] max-w-64
          transform transition-transform duration-200
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:transition-all
          ${collapsed ? "md:w-20" : "md:w-60"}
          md:shrink-0
        `}
      >
        <div>
          <div className="h-16 flex items-center justify-between px-5">
            {!collapsed && <img src="/logo.svg" alt="Logo" className="h-3 md:block" />}
            <Button type="text" onClick={() => setCollapsed((c) => !c)} aria-label="Toggle sidebar"
              icon={<img src="collapse.svg" alt="" className="w-4 h-4" />} className="hidden! md:inline-flex! w-7! h-7! text-slate-400!" />
            <Button type="text" onClick={() => setMobileOpen(false)} aria-label="Close menu"
              icon={<CloseOutlined className="text-base" />} className="md:hidden! w-7! h-7! text-slate-400!" />
          </div>

          <nav className="mt-4 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Button
                  key={item.key}
                  type="text"
                  onClick={() => go(item.getHref())}
                  className={`w-full! h-auto! flex! items-center! gap-3 px-3! py-2.5! rounded-lg! text-sm! font-medium! ${
                    isActive ? "bg-sky-500! text-white! shadow-sm shadow-sky-200" : "text-slate-500! hover:bg-slate-50!"
                  } ${collapsed ? "md:justify-center!" : "justify-start!"}`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className={collapsed ? "md:hidden" : ""}>{item.label}</span>
                </Button>
              );
            })}
          </nav>
        </div>

        <div className="p-3">
          <Button
            type="text"
            onClick={() => go(paths.home.getHref())}
            className={`w-full! h-auto! flex! items-center! gap-3 px-3! py-2.5! rounded-lg! text-sm! font-medium! text-slate-500! hover:bg-slate-50! ${
              collapsed ? "md:justify-center!" : "justify-start!"
            }`}
          >
            <img src="back.svg" alt="" />
            <span className={collapsed ? "md:hidden" : ""}>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  );
}