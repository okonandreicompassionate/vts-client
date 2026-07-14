import { useState } from "react";
import { ConfigProvider } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  LockOutlined,
  BellOutlined,
} from "@ant-design/icons";

/* ------------------------------------------------------------------ */
/* Data                                                                 */
/* ------------------------------------------------------------------ */

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: <AppstoreOutlined /> },
  { key: "visitors", label: "Visitors", icon: <img src="visitors.svg" alt="" /> },
  { key: "settings", label: "Settings", icon: <SettingOutlined /> },
] as const;

const settingsItems = [
  {
    key: "profile",
    title: "Profile Settings",
    description: "Update your name, email and contact info",
    icon: <UserOutlined />,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-500",
  },
  {
    key: "security",
    title: "Security",
    description: "Change password and two-factor authentication",
    icon: <LockOutlined />,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    key: "notifications",
    title: "Notifications",
    description: "Configure email alerts and report frequency",
    icon: <BellOutlined />,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-400",
  },
  {
    key: "system",
    title: "System Settings",
    description: "Set company name, badge prefix and visitor limits",
    icon: <SettingOutlined />,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export default function AdminSettings() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] =
    useState<(typeof navItems)[number]["key"]>("settings");

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#38bdf8",
          borderRadius: 8,
          fontFamily: "inherit",
        },
      }}
    >
      <div className="min-h-screen flex bg-[#EEF2F7]">
        {/* Sidebar */}
        <aside
          className={`${
            collapsed ? "w-20" : "w-60"
          } shrink-0 bg-white border-r border-slate-100 flex flex-col justify-between transition-all duration-200`}
        >
          <div>
            <div className="h-16 flex items-center justify-between px-5">
              {!collapsed && (
                <img src="/logo.svg" alt="Logo" className="h-3" />
              )}
              <button
                type="button"
                onClick={() => setCollapsed((c) => !c)}
                className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-50 transition"
                aria-label="Toggle sidebar"
              >
                <img src="collapse.svg" alt="" className="w-4 h-4" />
              </button>
            </div>

            <nav className="mt-4 px-3 space-y-1">
              {navItems.map((item) => {
                const isActive = activeNav === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveNav(item.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "bg-sky-500 text-white shadow-sm shadow-sky-200"
                        : "text-slate-500 hover:bg-slate-50"
                    } ${collapsed ? "justify-center" : ""}`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-3">
            <button
              type="button"
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 transition ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <img src="back.svg" alt="" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Topbar */}
          <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8">
            <h2 className="text-lg font-bold text-slate-800">Settings</h2>
            <div className="flex items-center gap-3">
              <div className="text-right leading-tight">
                <p className="text-sm font-semibold text-slate-800">
                  Admin User
                </p>
                <p className="text-xs text-slate-400">Super Admin</p>
              </div>
              <img
                src="https://i.pravatar.cc/40?img=68"
                alt="Admin User"
                className="w-9 h-9 rounded-full object-cover"
              />
            </div>
          </header>

          <main className="flex-1 px-8 py-6">
            <div className="space-y-4 max-w-4xl">
              {settingsItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className="w-full flex items-center gap-4 bg-white rounded-xl border border-slate-100 shadow-sm shadow-slate-100 px-6 py-4 text-left hover:border-slate-200 transition"
                >
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor}`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-bold text-slate-800">
                      {item.title}
                    </span>
                    <span className="block text-xs text-slate-400 mt-0.5">
                      {item.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </main>
        </div>
      </div>
    </ConfigProvider>
  );
}
