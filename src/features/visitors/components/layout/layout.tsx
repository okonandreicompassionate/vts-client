import { Outlet } from "react-router-dom";
import { useCallback } from "react";

import { useVisitorSocket } from "@/features/visitors/hooks/use-visitor-socket";

const Layout = () => {
  const visitorRegistration = (() => {
    const stored = localStorage.getItem("visitorRegistration");

    if (!stored) return null;

    try {
      return JSON.parse(stored) as {
        id?: string;
        visitorId?: string;
      };
    } catch {
      return null;
    }
  })();

  let visitorId: string | null | undefined =
    visitorRegistration?.visitorId ?? localStorage.getItem("visitorId");

  const stored = localStorage.getItem("visitorSession");

  let token: string | undefined;

  if (stored) {
    try {
      const session = JSON.parse(stored) as {
        visitorId?: string;
        accessToken?: string;
      };

      visitorId = session.visitorId;
      token = session.accessToken;
    } catch (err) {
      console.error(err);
    }
  }
  const handleStatusChanged = useCallback((data: { visitId: string; status: string }) => {
    console.log("Visit status changed:", data);
  }, []);

  useVisitorSocket({
    visitorId: visitorId ?? undefined,
    token: token ?? undefined,
    onStatusChanged: handleStatusChanged,
  });

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center bg-white px-4 py-10 sm:px-6 md:px-10 lg:px-14 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
