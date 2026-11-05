const Header = ({ className }: { className?: string }) => {
  return (
    <header
      className={`flex shrink-0 flex-col mt-8 items-center gap-1.5 px-4 pt-7 pb-2 md:hidden ${className}`}
    >
      <img src="/logo.svg" alt="GuestX" className="w-24 object-contain fixed left-3 top-4.5" />

      {/* <h1 className="text-sm font-semibold">Visitor management, simplified</h1> */}
    </header>
  );
};

export default Header;
