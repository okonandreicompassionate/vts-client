import { useGetProfileQuery } from "../../api/admin-api";
import { VisitorAvatar } from "../visitor-avatar.tsx";
import { ThemeToggle } from "../../../../components/ThemeToggle";

const Header = ({ title }: { title: string }) => {
  const { data: profile } = useGetProfileQuery(undefined);
  const displayName = profile?.fullName ?? profile?.name ?? profile?.email ?? "Admin User";
  const role = profile?.role ?? "Admin";

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-slate-100 bg-white/95 px-4 pt-3 pb-2.5 backdrop-blur md:px-8 md:py-0 dark:border-slate-800 dark:bg-slate-950/95">
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h2>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="text-right leading-tight">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{displayName}</p>
          <p className="text-xs text-slate-400 dark:text-slate-400">{role}</p>
        </div>
        <VisitorAvatar name={displayName} size="md" />
      </div>
    </header>
  );
};

export default Header;
