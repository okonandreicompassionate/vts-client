import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="grid min-h-screen bg-slate-50 md:grid-cols-[1fr_1fr] dark:bg-slate-950">
      <div className="hidden items-center justify-center bg-linear-to-br from-[#dbe9dd] via-[#f4f6f5] to-[#dce8ef] p-10 text-slate-700 md:flex dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
        <div className="text-center max-md:max-w-md">
          <div className="mb-10 flex justify-center">
            <img src="/loginimage.svg" alt="Secure visitor registration" loading="lazy" />
          </div>
          <h2 className="text-3xl font-semibold tracking-tight">Secure access made simple</h2>
          <p className="mt-4 text-slate-700 dark:text-slate-300">
            Verify your identity and complete registration faster with a secure, easy flow.
          </p>
        </div>
      </div>

      <div className="bg-white px-4 py-10 sm:px-6 md:px-10 lg:px-14 dark:bg-slate-950">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
