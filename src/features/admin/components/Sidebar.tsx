import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppstoreOutlined,
  SettingOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";

/* ------------------------------------------------------------------ */
/* Nav config                                                           */
/* ------------------------------------------------------------------ */
/* `path` is a placeholder route — point it at whatever you register   */
/* in your router (e.g. React Router's <Route path="/visitors" ... />) */

const navItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/admindashboard",
    icon: <img src="dashboard.svg" alt="" />,
    fallbackIcon: <AppstoreOutlined />,
  },
  {
    key: "visitors",
    label: "Visitors",
    path: "/visitorpage",
    icon: <img src="visitors.svg" alt="" />,
    fallbackIcon: <AppstoreOutlined />,
  },
  {
    key: "settings",
    label: "Settings",
    path: "/adminsettings",
    icon: <SettingOutlined />,
    fallbackIcon: <SettingOutlined />,
  },
];



export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const go = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      <div className="md:hidden h-14 flex items-center justify-between px-4 bg-white border-b border-slate-100">
        <img src="/logo.svg" alt="Logo" className="h-3" />
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-50 transition"
          aria-label="Open menu"
        >
          <MenuOutlined className="text-lg" />
        </button>
      </div>


      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* -------------------------------------------------------- */}
      {/* Sidebar / drawer                                          */}
      {/* -------------------------------------------------------- */}
      <aside
        className={`
          bg-white border-r border-slate-100 flex flex-col justify-between

          /* Mobile: fixed off-canvas drawer */
          fixed inset-y-0 left-0 z-50 w-[85vw] max-w-64
          transform transition-transform duration-200
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}

          /* Desktop: static in-flow sidebar, original behavior untouched */
          md:static md:translate-x-0 md:transition-all
          ${collapsed ? "md:w-20" : "md:w-60"}
          md:shrink-0
        `}
      >
        <div>
          <div className="h-16 flex items-center justify-between px-5">
            {!collapsed && (
              <img src="/logo.svg" alt="Logo" className="h-3 md:block" />
            )}
            {/* Desktop collapse toggle */}
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="hidden md:flex w-7 h-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-50 transition"
              aria-label="Toggle sidebar"
            >
              <img src="collapse.svg" alt="" className="w-4 h-4" />
            </button>
            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="md:hidden w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-50 transition"
              aria-label="Close menu"
            >
              <CloseOutlined className="text-base" />
            </button>
          </div>

          <nav className="mt-4 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => go(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-sky-500 text-white shadow-sm shadow-sky-200"
                      : "text-slate-500 hover:bg-slate-50"
                  } ${collapsed ? "md:justify-center" : ""}`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className={collapsed ? "md:hidden" : ""}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3">
          <button
            type="button"
            onClick={() => go("/")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 transition ${
              collapsed ? "md:justify-center" : ""
            }`}
          >
            <img src="back.svg" alt="" />
            <span className={collapsed ? "md:hidden" : ""}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
