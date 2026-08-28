import { DeleteOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import DeleteAdminModal from "./modals/deactivate-admin-modal";
import { useDeleteAdminMutation } from "../api/users-api-slice";
import { useOrganization } from "@/features/organizations";
import { usePopup } from "@/features/popup/hooks/use-popup";

interface DeleteAdminProps {
  adminId: string;
}

function getErrorStatus(error: unknown): number | string | undefined {
  if (error && typeof error === "object" && "status" in error) {
    return (error as { status?: number | string }).status;
  }

  return undefined;
}

export const DeleteAdmin = ({ adminId }: DeleteAdminProps) => {
  const navigate = useNavigate();
  const { orgSlug } = useOrganization();
  const { openModal } = usePopup();

  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();

  const handleDelete = async () => {
    if (!adminId || !orgSlug) {
      message.error("Unable to remove this admin.");
      return;
    }

    try {
      await deleteAdmin({
        orgSlug,
        adminId,
      }).unwrap();

      message.success("Admin removed successfully.");
      navigate(-1);
    } catch (error) {
      const status = getErrorStatus(error);

      if (status === 403) {
        message.error("You do not have permission to remove this admin.");
        return;
      }

      if (status === 404) {
        message.error("Admin not found.");
        return;
      }

      message.error("Admin could not be removed. Please try again.");
    }
  };

  const handleOpenModal = () => {
    openModal(<DeleteAdminModal onConfirm={handleDelete} loading={isDeleting} />);
  };

  return (
    <Button
      danger
      type="primary"
      icon={<DeleteOutlined className="align-middle" />}
      loading={isDeleting}
      onClick={handleOpenModal}
      className="my-auto inline-flex rounded-sm! h-6 w-30 gap-1 items-center justify-center"
    >
      Remove Admin
    </Button>
  );
};
