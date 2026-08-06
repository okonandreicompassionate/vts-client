import { SettingOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { usePopup } from "../../../hooks/usePopup.tsx";

import Header from "../components/layout/Header.tsx";
import EditProfileModal from "../components/modals/EditProfileModal.tsx";
import ManageSecurityModal from "../components/modals/ManageSecurityModal.tsx";
import NotificationPreferencesModal from "../components/modals/NotificationPreferencesModal.tsx";
import SystemSettingsModal from "../components/modals/SystemSettingsModal.tsx";

export default function AdminSettings() {
  const { openModal } = usePopup();
  

  const systemDescription = (
    <>
      <span>Set company name, badge prefix and visitor limits</span>
      
      
    </>
  );

  const settingsItems = [
    {
      key: "profile",
      title: "Profile Settings",
      description: "Update your name, email and contact info",
      icon: <img src="/profile.svg" alt="Profile" />,
      iconBg: "bg-sky-50",
      iconColor: "text-sky-500",
      modal: <EditProfileModal />,
    },
    {
      key: "security",
      title: "Security",
      description: "Change password and two-factor authentication",
      icon: <img src="/padlock2.svg" alt="Security" />,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      modal: <ManageSecurityModal />,
    },
    {
      key: "notifications",
      title: "Notifications",
      description: "Configure email alerts and report frequency",
      icon: <img src="/bell2.svg" alt="Notifications" />,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-400",
      modal: <NotificationPreferencesModal />,
    },
    {
      key: "system",
      title: "System Settings",
      description: systemDescription,
      icon: <SettingOutlined />,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-500",
      modal: <SystemSettingsModal />,
    },
  ];

  return (
    <>
      <Header title="Settings" />

      <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
        <div className="max-w-4xl space-y-3 sm:space-y-4">
          {settingsItems.map((item) => (
            <Button
              key={item.key}
              type="default"
              onClick={() => openModal(item.modal)}
              className="flex! h-auto! w-full! items-center! justify-start! gap-3 rounded-xl! border-slate-100! bg-white! px-4! py-4! text-left shadow-sm shadow-slate-100 hover:border-slate-200! sm:gap-4 sm:px-6! dark:border-slate-700! dark:bg-slate-800! dark:shadow-none dark:hover:border-slate-600!"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.iconBg} ${item.iconColor}`}
              >
                {item.icon}
              </span>
              <span className="flex-1 whitespace-normal">
                <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-xs font-normal text-slate-400">
                  {item.description}
                </span>
              </span>
            </Button>
          ))}
        </div>
      </main>
    </>
  );
}
