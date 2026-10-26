import { useGetVisitQuery } from "../api/admins-visit-api-slice";
import type { VisitorRow } from "../utils/visits";
import { formatVisitTime } from "../utils/visits";

export function VisitorCheckoutTime({ visitor }: { visitor: VisitorRow }) {
  const needsDetails = visitor.status === "Signed Off" && !visitor.checkOutTime;
  const { data, isLoading, isError, error } = useGetVisitQuery(visitor.id, {
    skip: !needsDetails,
  });

  if (visitor.checkOutTime) {
    return <span>{formatVisitTime(visitor.checkOutTime)}</span>;
  }

  if (!needsDetails) {
    return <span>{visitor.checkOut}</span>;
  }

  if (isLoading) {
    return <span>Loading checkout time…</span>;
  }

  if (isError) {
    const errorMessage =
      error && typeof error === "object" && "error" in error
        ? error.error
        : "Unable to retrieve the checkout time.";

    return <span title={errorMessage}>Unavailable</span>;
  }

  return data?.checkOutTime ? (
    <span>{formatVisitTime(data.checkOutTime)}</span>
  ) : (
    <span title="The visit is signed out, but the server did not return a checkout timestamp.">
      Unavailable
    </span>
  );
}
