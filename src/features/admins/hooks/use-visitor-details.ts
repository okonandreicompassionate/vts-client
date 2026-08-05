import { useMemo } from "react";
import { useGetVisitQuery } from "../api/admin-api";
import { toVisitorRow, type VisitorRow } from "../utils/visits";

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