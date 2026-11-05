import { Button, Tooltip } from "antd";
import { SyncOutlined } from "@ant-design/icons";

interface RefreshButtonProps {
  loading?: boolean;
  onClick: () => void;
}

/** The page header's Refresh action: icon only, named by its tooltip and aria-label. */
export function RefreshButton({ loading = false, onClick }: RefreshButtonProps) {
  return (
    <Tooltip title="Refresh">
      <Button aria-label="Refresh" icon={<SyncOutlined />} loading={loading} onClick={onClick} />
    </Tooltip>
  );
}
