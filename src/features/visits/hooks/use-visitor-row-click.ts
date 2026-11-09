import { useNavigate } from "react-router-dom";
import type { VisitorRow } from "../utils/visits";
import { paths } from "../../../config/paths";

export function useVisitorRowClick() {
  const navigate = useNavigate();

  return (record: VisitorRow) => ({
    onClick: () => navigate(paths.admin.visitorDetails.getHref(record.id)),
    style: { cursor: "pointer" } as const,
  });
}
