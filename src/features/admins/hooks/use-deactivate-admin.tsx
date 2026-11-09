import { message } from "antd";

import { usePopup } from "@/lib/contexts/popup/use-popup";
import { getApiErrorMessage } from "@/utils/api-error";
import { useDeactivateAdminMutation } from "../api/admins-api-slice";

/** Deactivate-admin confirmation, shared by the details page button and the drawer menu. */
export function useDeactivateAdmin() {
  const { confirm, closeDrawer } = usePopup();
  const [deactivateAdmin, { isLoading: isDeactivating }] = useDeactivateAdminMutation();

  const confirmDeactivate = (adminId: string) =>
    confirm({
      title: "Deactivate Admin",
      description:
        "Deactivating this admin will revoke their administrative access to this organization. This action cannot be undone.",
      okText: "Deactivate",
      danger: true,
      onConfirm: async () => {
        try {
          await deactivateAdmin({ adminId }).unwrap();
        } catch (error) {
          message.error(getApiErrorMessage(error, "Admin could not be deactivated. Please try again."));
          throw error;
        }

        message.success("Admin deactivated successfully.");
        // The details drawer shows an admin that no longer exists.
        closeDrawer();
      },
    });

  return { confirmDeactivate, isDeactivating };
}
