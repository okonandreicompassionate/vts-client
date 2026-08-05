const LoginLeft = () => {
  return (
    <div>
      <div className="relative hidden h-full w-full flex-col justify-between overflow-hidden bg-[#EFF7FB] from-sky-50 to-white px-4 py-8 sm:px-6 md:flex md:px-16 md:py-12 dark:bg-slate-900 dark:from-slate-950 dark:to-slate-900">
        <div className="pointer-events-none absolute -top-10 right-0 left-0 h-24" />

        {/* Logo */}
        <div className="absolute text-center">
          <img src="/logo.svg" alt="" className="w-32 lg:mt-0 lg:-mb-40 lg:ml-40" />
        </div>

        {/* Illustration */}
        <div className="flex flex-1 items-center justify-center">
          <img src="loginimage.svg" alt="" className="w-72 object-cover lg:mt-12" />
        </div>

        {/* Title + subtitle */}
        <div className="mb-10 text-center md:text-left lg:ml-24">
          <h2 className="text-2xl font-bold text-slate-800 md:text-3xl lg:ml-3 dark:text-slate-100">
            Visitor Tracker
          </h2>
          <p className="mt-1 text-slate-400 lg:mr-2.5 dark:text-slate-400">
            Ensure Secure Visitor Check-Ins and Approvals
          </p>
        </div>

        {/* Footer */}
        <div>
          <p className="mt-8 text-sm text-slate-400">© 2026 Zoracom. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginLeft;
