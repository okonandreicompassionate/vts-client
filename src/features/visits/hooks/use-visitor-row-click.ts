import { useNavigate } from "react-router-dom";
import type { VisitorRow } from "../utils/visits";
import { paths } from "../../../config/paths";
import {useTenant} from '../../../lib/tenant'

export function useVisitorRowClick() {
  const { orgSlug } = useTenant();
  const navigate = useNavigate();

  return (record: VisitorRow) => ({
    onClick: () => navigate(paths.admin.visitorDetails.getHref(orgSlug, record.id)),
    style: { cursor: "pointer" } as const,
  });
}
