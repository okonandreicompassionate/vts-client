import { DeleteOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import DeactivateAdminModal from "./modals/deactivate-admin-modal";
import { useDeactivateAdminMutation } from "../api/admins-api-slice";
import { useOrganization } from "@/features/organizations";
import { usePopup } from "@/features/popup/hooks/use-popup";

interface DeactivateAdminProps {
  adminId: string;
}

function getErrorStatus(error: unknown): number | string | undefined {
  if (error && typeof error === "object" && "status" in error) {
    return (error as { status?: number | string }).status;
  }

  return undefined;
}

export const DeactivateAdmin = ({ adminId }: DeactivateAdminProps) => {
  const navigate = useNavigate();
  const { orgSlug } = useOrganization();
  const { openModal } = usePopup();

  const [deactivateAdmin, { isLoading: isDeactivating }] =
    useDeactivateAdminMutation();

  const handleDeactivate = async () => {
    if (!adminId || !orgSlug) {
      message.error("Unable to deactivate this admin.");
      return;
    }

    try {
      await deactivateAdmin({
        orgSlug,
        adminId,
      }).unwrap();

      message.success("Admin deactivated successfully.");
      navigate(-1);
    } catch (error) {
      const status = getErrorStatus(error);

      if (status === 403) {
        message.error("You do not have permission to deactivate this admin.");
        return;
      }

      if (status === 404) {
        message.error("Admin not found.");
        return;
      }

      message.error("Admin could not be deactivated. Please try again.");
    }
  };

  const handleOpenModal = () => {
    openModal(
      <DeactivateAdminModal
        onConfirm={handleDeactivate}
        loading={isDeactivating}
      />,
    );
  };

  return (
    <Button
      danger
      type="primary"
      icon={<DeleteOutlined className="align-middle" />}
      loading={isDeactivating}
      onClick={handleOpenModal}
      className="my-auto inline-flex h-6 w-30 items-center justify-center gap-1 rounded-sm!"
    >
      Deactivate
    </Button>
  );
};
