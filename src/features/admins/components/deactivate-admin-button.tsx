import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useDeactivateAdmin } from "../hooks/use-deactivate-admin";

interface DeactivateAdminProps {
  adminId: string;
}

/** On the full admin details page; the drawer has the same action in its header menu. */
export const DeactivateAdmin = ({ adminId }: DeactivateAdminProps) => {
  const { confirmDeactivate, isDeactivating } = useDeactivateAdmin();

  return (
    <Button
      danger
      type="primary"
      icon={<DeleteOutlined className="align-middle" />}
      loading={isDeactivating}
      disabled={!adminId}
      onClick={() => confirmDeactivate(adminId)}
    >
      Deactivate
    </Button>
  );
};
