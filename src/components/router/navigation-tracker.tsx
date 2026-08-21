import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { rememberRoute } from "@/lib/router/route-history";

export default function NavigationTracker() {
  const location = useLocation();

  useEffect(() => {
    rememberRoute(location.pathname);
  }, [location.pathname]);

  return null;
}