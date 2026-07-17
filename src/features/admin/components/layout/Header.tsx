const Header = ({ title }: { title: string }) => {
  return (
    <header className="min-h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 pt-3 pb-2.5 md:px-8 md:py-0">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <p className="text-sm font-semibold text-slate-800">Admin User</p>
          <p className="text-xs text-slate-400">Super Admin</p>
        </div>
        <img
          src="https://i.pravatar.cc/40?img=68"
          alt="Admin User"
          className="w-9 h-9 rounded-full object-cover"
        />
      </div>
    </header>
  );
};

export default Header;
