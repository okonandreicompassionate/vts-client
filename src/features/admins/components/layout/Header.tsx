
import { Button } from "antd";

import { Spinner } from "@/components/spinner";
import { ThemeToggle } from "../../../../components/theme-toggle";
import { useGetProfileQuery } from "../../api/admin-api-slice";
import { useLogout } from "../../hooks/use-logout";
import { VisitorAvatar } from "../visitor-avatar";

const Header = ({ title }: { title: string }) => {
  const { data: profile, isLoading } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const logout = useLogout();

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return <Spinner />;
  }

  const displayName = profile?.fullName ?? profile?.email ?? "Admin User";
  const role = profile?.role ?? "Admin";

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur md:px-8 dark:border-slate-800 dark:bg-slate-950/95">

      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
        {title}
      </h2>

      <div className="flex items-center gap-1">
        <ThemeToggle />

        <div className="flex items-center gap-2">
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {displayName}
            </p>

            <p className="text-xs text-slate-400 dark:text-slate-500">
              {role}
            </p>
          </div>

          <VisitorAvatar name={displayName} size="sm" />

          {/* Logout */}
          <Button
            type="text"
            onClick={handleLogout}
            className="flex h-auto items-center rounded-lg text-xs text-slate-500 font-medium hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <img src="/back.svg" alt="" className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

