import { DeleteOutlined } from "@ant-design/icons";

import CustomDrawer from "@/components/ui/custom-drawer";
import { useGetProfileQuery } from "@/lib/auth/profile-api";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { adminManagementRoles } from "@/types/user-role";
import { useDeactivateAdmin } from "../hooks/use-deactivate-admin";
import AdminDetails from "./admin-details";

/** Open with `openDrawer(<AdminDetailsDrawer adminId={id} />)`. Deactivate is in the header menu. */
export default function AdminDetailsDrawer({ adminId }: { adminId: string }) {
  const { closeDrawer } = usePopup();
  const { data: profile } = useGetProfileQuery();
  const { confirmDeactivate } = useDeactivateAdmin();
  const canManageAdmins = profile ? adminManagementRoles.includes(profile.role) : false;

  return (
    <CustomDrawer
      title="Admin Details"
      width={420}
      flush
      actions={{
        secondary: canManageAdmins
          ? [
              {
                key: "deactivate",
                label: "Deactivate",
                icon: <DeleteOutlined />,
                danger: true,
                onSelect: () => confirmDeactivate(adminId),
              },
            ]
          : [],
      }}
    >
      <AdminDetails adminId={adminId} onClose={closeDrawer} />
    </CustomDrawer>
  );
}
