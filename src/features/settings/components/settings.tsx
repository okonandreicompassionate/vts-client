import { QrcodeOutlined, SettingOutlined } from "@ant-design/icons";
import VisitorQrModal from "@/components/visitor-qr/visitor-qr-modal";
import { Button } from "antd";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { useGetProfileQuery } from "@/lib/auth/profile-api";
import { PageShell } from "@/components/page";
import EditProfileModal from "./modals/edit-profile-modal.tsx";
import ManageSecurityModal from "./modals/manage-security-modal.tsx";
import NotificationPreferencesModal from "@/features/notifications/components/notifications-preferences-modal.tsx";
import SystemSettingsModal from "./modals/system-settings-modal.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";

export default function AdminSettings() {
  const { openModal } = usePopup();
  const { data: profile, isLoading: isLoadingProfile } = useGetProfileQuery();

  const canManageSystemSettings = profile?.role === "SUPERADMIN";

  if (isLoadingProfile) {
    return (
      <PageShell title="Settings">
        <Spinner variant="page" />
      </PageShell>
    );
  }

  const systemDescription = (
    <>
      <span>Set company details, visitor limits and email verification</span>
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
    {
      key: "visitor-qr",
      title: "Visitor QR Code",
      description: "Print the gate poster visitors scan to register",
      icon: <QrcodeOutlined />,
      iconBg: "bg-sky-50",
      iconColor: "text-sky-500",
      modal: <VisitorQrModal />,
    },
    ...(canManageSystemSettings
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
    <PageShell title="Settings" description="Your profile, security and notification preferences.">
      <div className="w-full max-w-4xl space-y-3 sm:space-y-4 md:max-w-full">
        {settingsItems.map((item) => (
          <Button
            key={item.key}
            type="default"
            onClick={() => openModal(item.modal)}
            className="flex! h-auto! w-full! items-center! justify-center! rounded-xl! border-slate-200! bg-white! px-4! py-3! text-left! hover:border-slate-200! sm:gap-4 sm:px-6! lg:justify-start! lg:text-left! dark:border-zinc-700! dark:bg-zinc-800! dark:hover:border-zinc-600!"
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.iconBg} ${item.iconColor}`}
            >
              {item.icon}
            </span>
            <span className="flex-1 whitespace-normal">
              <span className="block text-[13px] font-bold text-slate-800 dark:text-zinc-100">
                {item.title}
              </span>
              <span className="mt-0.5 block text-xs font-normal text-slate-400 dark:text-zinc-400">
                {item.description}
              </span>
            </span>
          </Button>
        ))}
      </div>
    </PageShell>
  );
}
