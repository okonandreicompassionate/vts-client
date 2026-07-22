import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#EEF2F7] md:grid md:grid-cols-2">
      <div className="hidden items-center justify-center bg-linear-to-br from-[#dbe9dd] via-[#f4f6f5] to-[#dce8ef] p-10 text-slate-700 md:flex">
        <div className="text-center max-md:max-w-md">
          <div className="mb-10 flex justify-center">
            <img
              src="/loginimage.svg"
              alt="Secure visitor registration"
              loading="lazy"
              //   className="mx-auto h-80 w-auto"
            />
          </div>
          <h2 className="text-3xl font-semibold tracking-tight">Secure access made simple</h2>
          <p className="mt-4 text-slate-700">
            Verify your identity and complete registration faster with a secure, easy flow.
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center bg-white px-4 py-10 sm:px-6 md:px-10 lg:px-14">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
