import { SettingOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { usePopup } from "../../../hooks/usePopup.tsx";
import Header from "../components/layout/Header.tsx";
import EditProfileModal from "../components/modals/EditProfileModal.tsx";
import ManageSecurityModal from "../components/modals/ManageSecurityModal.tsx";
import NotificationPreferencesModal from "../components/modals/NotificationPreferencesModal.tsx";
import SystemSettingsModal from "../components/modals/SystemSettingsModal.tsx";

const settingsItems = [
  { key: "profile", title: "Profile Settings", description: "Update your name, email and contact info", icon: <img src="/profile.svg" alt="Profile" />, iconBg: "bg-sky-50", iconColor: "text-sky-500", modal: <EditProfileModal /> },
  { key: "security", title: "Security", description: "Change password and two-factor authentication", icon: <img src="/padlock2.svg" alt="Security" />, iconBg: "bg-emerald-50", iconColor: "text-emerald-500", modal: <ManageSecurityModal /> },
  { key: "notifications", title: "Notifications", description: "Configure email alerts and report frequency", icon: <img src="/bell2.svg" alt="Notifications" />, iconBg: "bg-orange-50", iconColor: "text-orange-400", modal: <NotificationPreferencesModal /> },
  { key: "system", title: "System Settings", description: "Set company name, badge prefix and visitor limits", icon: <SettingOutlined />, iconBg: "bg-slate-100", iconColor: "text-slate-500", modal: <SystemSettingsModal /> },
];

export default function AdminSettings() {
  const { openModal } = usePopup();

  return (
    <>
      <Header title="Settings" />

      <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
        <div className="space-y-3 max-w-4xl sm:space-y-4">
          {settingsItems.map((item) => (
            <Button
              key={item.key}
              type="default"
              onClick={() => openModal(item.modal)}
              className="w-full! h-auto! flex! items-center! justify-start! gap-3 bg-white! rounded-xl! border-slate-100! shadow-sm shadow-slate-100 px-4! py-4! text-left hover:border-slate-200! sm:gap-4 sm:px-6!"
            >
              <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor}`}>
                {item.icon}
              </span>
              <span className="flex-1 whitespace-normal">
                <span className="block text-sm font-bold text-slate-800">{item.title}</span>
                <span className="block text-xs text-slate-400 mt-0.5 font-normal">{item.description}</span>
              </span>
            </Button>
          ))}
        </div>
      </main>
    </>
  );
}