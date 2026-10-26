import { useGetVisitStatsQuery } from "../api/admins-visit-api-slice";

export function useVisitorStats(enabled = true) {
  const { data } = useGetVisitStatsQuery(undefined, { skip: !enabled });

  return {
    total: data?.total ?? 0,
    signedIn: data?.signedIn ?? 0,
    signedOff: data?.signedOff ?? 0,
    pending: data?.pending ?? 0,
    rejected: data?.rejected ?? 0,
  };
}