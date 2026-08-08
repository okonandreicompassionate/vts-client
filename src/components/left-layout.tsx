const LoginLeft = () => {
  return (
    <div className="hidden h-full w-full flex-col gap-2 overflow-hidden bg-[#EFF7FB] px-8 py-10 md:flex md:px-16 md:py-12 dark:bg-slate-900">
      <div className="flex w-full justify-center">
        <img src="/logo.svg" alt="" className="h-20 w-32" />
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center">
        <img src="/loginimage.svg" alt="" className="max-h-full w-72 object-contain" />
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-bold text-slate-800 md:text-3xl dark:text-slate-100">
          Visitor Tracker
        </h2>
        <p className="text-slate-400 dark:text-slate-400">
          Ensure Secure Visitor Check-Ins and Approvals
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-slate-400">
        {`©  ${new Date().getFullYear()} Zoracom. All Rights Reserved.`}
      </p>
    </div>
  );
};

export default LoginLeft;