const LoginLeft = () => {
  return (
    <div>
      <div className="relative hidden h-full w-full flex-col overflow-hidden bg-[#EFF7FB] from-sky-50 to-white py-8 md:flex md:px-16 md:py-12 dark:bg-slate-900 dark:from-slate-950 dark:to-slate-900">

       
        <div className="flex w-full justify-center">
          <img src="/logo.svg" alt="" className="w-32" />
        </div>

      
        <div className="flex flex-1 items-center justify-center">
          <img src="/loginimage.svg" alt="" className="w-72 object-cover lg:mt-12" />
        </div>

       
        <div className="mb-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-800 md:text-3xl text-center dark:text-slate-100">
            Visitor Tracker
          </h2>
          <p className=" text-slate-400 text-center dark:text-slate-400">
            Ensure Secure Visitor Check-Ins and Approvals
          </p>
        </div>

       
        <div>
          <p className="mt-8 text-sm text-slate-400">© 2026 Zoracom. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginLeft;
