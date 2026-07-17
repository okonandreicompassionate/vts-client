import { useState } from "react";
import { ConfigProvider, Switch } from "antd";
import { SettingOutlined, CloseOutlined } from "@ant-design/icons";
import Sidebar from "../components/Sidebar.tsx";
import { usePopup } from "../hooks/usePopup.tsx";
import EditProfileModal from "../components/modals/EditProfileModal.tsx";

/* ------------------------------------------------------------------ */
/* Data                                                                 */
/* ------------------------------------------------------------------ */

const settingsItems = [
  {
    key: "profile",
    title: "Profile Settings",
    description: "Update your name, email and contact info",
    icon: <img src="/profile.svg" alt="Profile" />,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-500",
  },
  {
    key: "security",
    title: "Security",
    description: "Change password and two-factor authentication",
    icon: <img src="/padlock2.svg" alt="Security" />,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    key: "notifications",
    title: "Notifications",
    description: "Configure email alerts and report frequency",
    icon: <img src="/bell2.svg" alt="Notifications" />,
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
/* Manage Security modal                                               */
/* ------------------------------------------------------------------ */

interface ManageSecurityModalProps {
  open: boolean;
  onClose: () => void;
}

function ManageSecurityModal({ open, onClose }: ManageSecurityModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-500/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-800">Manage Security</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            <CloseOutlined className="text-xs" />
          </button>
        </div>

        <p className="text-[11px] font-bold tracking-wide text-slate-400 mb-3">
          CHANGE PASSWORD
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-[#F5FBFE] px-3.5 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full rounded-lg border border-slate-200 bg-[#F5FBFE] px-3.5 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full rounded-lg border border-slate-200 bg-[#F5FBFE] px-3.5 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-300"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 mb-6">
          <div className="pr-4">
            <p className="text-sm font-bold text-slate-800 leading-tight">
              Two-Factor Authentication
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Add an extra layer of security to your account
            </p>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onChange={setTwoFactorEnabled}
            className={twoFactorEnabled ? "bg-sky-500" : ""}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-[#F5FBFE] border border-[#E4E9F0] text-sm font-semibold text-slate-400 hover:bg-slate-100 transition h-10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-[#00AFEF] text-[13px] text-white hover:bg-sky-600 transition h-10 "
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Notification Preferences modal                                      */
/* ------------------------------------------------------------------ */

interface NotificationPreferencesModalProps {
  open: boolean;
  onClose: () => void;
}

function NotificationPreferencesModal({
  open,
  onClose,
}: NotificationPreferencesModalProps) {
  const [checkInAlerts, setCheckInAlerts] = useState(true);
  const [pendingApprovalAlerts, setPendingApprovalAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);
  const [vipSms, setVipSms] = useState(false);

  if (!open) return null;

  const toggleRows = [
    {
      label: "Email alerts for new visitor check-ins",
      checked: checkInAlerts,
      onChange: setCheckInAlerts,
    },
    {
      label: "Email alerts for pending approvals",
      checked: pendingApprovalAlerts,
      onChange: setPendingApprovalAlerts,
    },
    {
      label: "Daily summary report",
      checked: dailySummary,
      onChange: setDailySummary,
    },
    {
      label: "SMS alerts for VIP guests",
      checked: vipSms,
      onChange: setVipSms,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-500/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-800">
            Notification Preferences
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            <CloseOutlined className="text-xs" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {toggleRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">
                {row.label}
              </span>
              <Switch
                checked={row.checked}
                onChange={row.onChange}
                className={row.checked ? "bg-sky-500" : ""}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-[#F5FBFE] border border-[#E4E9F0] text-sm font-semibold text-slate-400 hover:bg-slate-100 transition h-10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-[#00AFEF] text-[13px] text-white hover:bg-sky-600 transition h-10"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* System Settings modal                                               */
/* ------------------------------------------------------------------ */

interface SystemSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

function SystemSettingsModal({ open, onClose }: SystemSettingsModalProps) {
  const [companyName, setCompanyName] = useState("Zoracom");
  const [badgePrefix, setBadgePrefix] = useState("ZOR-");
  const [maxCapacity, setMaxCapacity] = useState("250");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-500/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl px-6 py-6">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">System Settings</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            <CloseOutlined className="text-xs" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-[#F5F9FC] px-3.5 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              Visitor Badge Prefix
            </label>
            <input
              type="text"
              value={badgePrefix}
              onChange={(e) => setBadgePrefix(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-[#F5F9FC] px-3.5 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              Max Visitor Capacity Per Day
            </label>
            <input
              type="text"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-[#F5F9FC] px-3.5 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-400 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-sky-500 text-sm font-bold text-white hover:bg-sky-600 transition"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export default function AdminSettings() {
  const [manageSecurityOpen, setManageSecurityOpen] = useState(false);
  const [notificationPrefsOpen, setNotificationPrefsOpen] = useState(false);
  const [systemSettingsOpen, setSystemSettingsOpen] = useState(false);

  const { openModal } = usePopup();
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
      <div className="min-h-screen flex flex-col md:flex-row bg-[#EEF2F7]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 w-full">
          {/* Topbar */}
          <header className="min-h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 pt-3 pb-2.5 md:px-8 md:py-0">
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

          <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
            <div className="space-y-3 max-w-4xl sm:space-y-4">
              {settingsItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    if (item.key === "profile") openModal(<EditProfileModal />);
                    if (item.key === "security") setManageSecurityOpen(true);
                    if (item.key === "notifications")
                      setNotificationPrefsOpen(true);
                    if (item.key === "system") setSystemSettingsOpen(true);
                  }}
                  className="w-full flex items-center gap-3 bg-white rounded-xl border border-slate-100 shadow-sm shadow-slate-100 px-4 py-4 text-left hover:border-slate-200 transition sm:gap-4 sm:px-6"
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

      <ManageSecurityModal
        open={manageSecurityOpen}
        onClose={() => setManageSecurityOpen(false)}
      />

      <NotificationPreferencesModal
        open={notificationPrefsOpen}
        onClose={() => setNotificationPrefsOpen(false)}
      />

      <SystemSettingsModal
        open={systemSettingsOpen}
        onClose={() => setSystemSettingsOpen(false)}
      />
    </ConfigProvider>
  );
}
