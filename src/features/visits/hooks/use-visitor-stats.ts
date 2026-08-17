import { useGetVisitStatsQuery } from "../api/admins-visit-api-slice";

export function useVisitorStats() {
  const { data } = useGetVisitStatsQuery();

  return {
    total: data?.total ?? 0,
    signedIn: data?.signedIn ?? 0,
    signedOff: data?.signedOff ?? 0,
    pending: data?.pending ?? 0,
    rejected: data?.rejected ?? 0,
  };
}