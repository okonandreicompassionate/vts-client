import { useGetProfileQuery } from "../../api/admin-api";

const Header = ({ title }: { title: string }) => {
  const { data: profile } = useGetProfileQuery(undefined);
  const displayName = profile?.fullName ?? profile?.name ?? profile?.email ?? "Admin User";
  const role = profile?.role ?? "Admin";
  const avatar = profile?.avatar ?? `https://i.pravatar.cc/40?u=${encodeURIComponent(displayName)}`;

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-slate-100 bg-white/95 px-4 pt-3 pb-2.5 backdrop-blur md:px-8 md:py-0">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <p className="text-sm font-semibold text-slate-800">{displayName}</p>
          <p className="text-xs text-slate-400">{role}</p>
        </div>
        <img
          src={avatar}
          alt={displayName}
          className="h-9 w-9 rounded-full object-cover"
        />
      </div>
    </header>
  );
};

export default Header;
