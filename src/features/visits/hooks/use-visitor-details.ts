import { useMemo } from "react";
import { toVisitorRow, type VisitorRow } from "../utils/visits";
import { useGetVisitQuery } from "../api/admins-visit-api-slice";

export function useVisitorDetails(id?: string) {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetVisitQuery(id!, {
    skip: !id,
  });

  const visitor = useMemo<VisitorRow | null>(() => {
    if (!data) return null;

    return toVisitorRow(data, 0);
  }, [data]);

  return {
    visitor,
    isLoading,
    isError,
    error,
  };
}