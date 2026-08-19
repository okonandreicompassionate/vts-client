import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";

import { useDeleteAdminMutation } from "../api/users-api-slice";
import { useTenant } from "@/lib/tenant";

interface DeleteAdminProps {
  adminId: string;
  role: string;
}

function getErrorStatus(error: unknown): number | string | undefined {
  if (error && typeof error === "object" && "status" in error) {
    return (error as { status?: number | string }).status;
  }

  return undefined;
}

export const DeleteAdmin = ({
  adminId,
  role,
}: DeleteAdminProps) => {
  const navigate = useNavigate();
  const { orgSlug } = useTenant();

  const [deleteAdmin, { isLoading: isDeleting }] =
    useDeleteAdminMutation();

  const handleDelete = async () => {
    if (!adminId || !orgSlug) {
      message.error("Unable to delete this admin.");
      return;
    }

    try {
      await deleteAdmin({
        orgSlug,
        adminId,
      }).unwrap();

      message.success("Admin deleted successfully.");
      navigate(-1);
    } catch (error) {
      const status = getErrorStatus(error);

      if (status === 403) {
        message.error(
          "You do not have permission to delete this admin.",
        );
        return;
      }

      if (status === 404) {
        message.error("Admin not found.");
        return;
      }

      message.error(
        "Failed to delete admin. Please try again.",
      );
    }
  };

  if (role !== "ADMIN") {
    return null;
  }

  return (
    <Popconfirm
      title="Delete this admin?"
      description="This action cannot be undone."
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{
        danger: true,
        loading: isDeleting,
      }}
      onConfirm={handleDelete}
      disabled={isDeleting}
    >
      <Button
        danger
        type="default"
        icon={<DeleteOutlined />}
        loading={isDeleting}
      >
        Delete Admin
      </Button>
    </Popconfirm>
  );
};