const VisitorHeader = () => {
  return (
    <header className="flex shrink-0 flex-col items-center gap-1.5 px-4 pt-7 pb-2 md:hidden">
      <img
        src="/logo.svg"
        alt="Visitor Tracker"
        className="w-24 object-contain border-0! outline-none! shadow-none!"
      />

      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
        Visitor Tracker
      </h2>
    </header>
  );
};

export default VisitorHeader;