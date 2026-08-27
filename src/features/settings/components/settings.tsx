import { SettingOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { usePopup } from "@/features/popup/hooks/use-popup";
import { useGetProfileQuery } from "../api/settings-api-slice.ts";
import Header from "@/app/routes/admin/layout/dashboard-header.tsx";
import EditProfileModal from "./modals/edit-profile-modal.tsx";
import ManageSecurityModal from "./modals/manage-security-modal.tsx";
import NotificationPreferencesModal from "@/features/notifications/components/notifications-preferences-modal.tsx";
import SystemSettingsModal from "./modals/system-settings-modal.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";

export default function AdminSettings() {
  const { openModal } = usePopup();
  const { data: profile, isLoading: isLoadingProfile } = useGetProfileQuery();

  const isSuperAdmin = profile?.role === "SUPERADMIN";

  if (isLoadingProfile) {
    return (
      <div>
        <Header title="Settings" />

        <main className="flex-1 px-2 pt-1 pb-3 sm:px-2 md:px-2 md:py-3">
          <Spinner variant="page" />
        </main>
      </div>
    );
  }

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
      description: "Change your password",
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
    ...(isSuperAdmin
      ? [
          {
            key: "system",
            title: "System Settings",
            description: systemDescription,
            icon: <SettingOutlined />,
            iconBg: "bg-slate-100",
            iconColor: "text-slate-500",
            modal: <SystemSettingsModal />,
          },
        ]
      : []),
  ];

  return (
    <div>
      <Header title="Settings" />

      <main className="flex-1 px-2 pt-1 pb-3 sm:px-2 md:px-2 md:py-3">
        <div className="w-full max-w-4xl space-y-3 sm:space-y-4 md:max-w-full">
          {settingsItems.map((item) => (
            <Button
              key={item.key}
              type="default"
              onClick={() => openModal(item.modal)}
              className="flex! h-auto! w-full! items-center! justify-center! rounded-xl! border-slate-100! bg-white! px-4! py-3! text-left! shadow-sm shadow-slate-100 hover:border-slate-200! sm:gap-4 sm:px-6! lg:justify-start! lg:text-left! dark:border-slate-700! dark:bg-slate-800! dark:shadow-none dark:hover:border-slate-600!"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.iconBg} ${item.iconColor}`}
              >
                {item.icon}
              </span>
              <span className="flex-1 whitespace-normal">
                <span className="block text-[13px] font-bold text-slate-800 dark:text-slate-100">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-xs font-normal text-slate-400 dark:text-slate-400">
                  {item.description}
                </span>
              </span>
            </Button>
          ))}
        </div>
      </main>
    </div>
  );
}
