import { useNavigate } from "react-router-dom";
import type { VisitorRow } from "../utils/visits";
import { paths } from "../../../config/paths";
import { useOrganization } from "@/features/organizations";

export function useVisitorRowClick() {
  const { orgSlug } = useOrganization();
  const navigate = useNavigate();

  return (record: VisitorRow) => ({
    onClick: () => navigate(paths.admin.visitorDetails.getHref(orgSlug, record.id)),
    style: { cursor: "pointer" } as const,
  });
}
