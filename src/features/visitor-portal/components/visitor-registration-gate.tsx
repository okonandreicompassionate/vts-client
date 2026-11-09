import { Alert, Button } from "antd";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { paths } from "@/config/paths";
import { useOrganization } from "../hooks/use-organization";
import { useGetVisitorVerificationStatusQuery } from "../api/public-visits-api-slice";

export default function VisitorRegistrationGate() {
  const { orgSlug } = useOrganization();
  const location = useLocation();
  const expectedEmail = (location.state as { entryEmail?: string } | null)?.entryEmail;
  const { data, isLoading, isFetching, isError, refetch } = useGetVisitorVerificationStatusQuery(
    orgSlug,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
      pollingInterval: 15000,
    },
  );

  if (isLoading || (isFetching && expectedEmail && data?.entryEmail !== expectedEmail))
    return <Spinner variant="screen" />;
  if (isFetching && data?.requireVisitorEmailVerification && !data.verified)
    return <Spinner variant="screen" />;
  if (isError || !data)
    return (
      <div className="mx-auto max-w-md p-6">
        <Alert type="error" message="Unable to load visitor settings" />
        <Button onClick={() => void refetch()}>Try again</Button>
      </div>
    );
  if (
    !data.entryEmail ||
    (expectedEmail && data.entryEmail !== expectedEmail) ||
    (data.requireVisitorEmailVerification && (!data.verified || data.email !== data.entryEmail))
  ) {
    return <Navigate to={paths.verify.getHref(orgSlug)} replace />;
  }
  return <Outlet />;
}
