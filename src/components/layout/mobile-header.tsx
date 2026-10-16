const Header = ({ className }: { className?: string }) => {
  return (
    <header
      className={`flex shrink-0 flex-col items-center gap-1.5 px-4 pt-7 pb-2 md:hidden ${className}`}
    >
      <img src="/logo.png" alt="VisitorX" className="w-28 object-contain" />

      <h1 className="text-lg font-bold text-slate-900">Visitor management, simplified</h1>
    </header>
  );
};

export default Header;
