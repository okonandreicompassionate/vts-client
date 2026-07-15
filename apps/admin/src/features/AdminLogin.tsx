import { useState } from "react";
import type { SubmitEventHandler } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Left panel */}
      <div className="relative w-full md:w-1/2 bg-gradient-to-br from-sky-50 to-white flex flex-col justify-between px-8 py-10 md:px-16 md:py-12 overflow-hidden">
        {/* soft top shadow accent like the reference */}
        <div className="pointer-events-none absolute -top-10 left-0 right-0 h-24 " />

        {/* Logo */}
        <div>
         <img src="/logo.svg" alt="" className="w-[125px] lg:-mt-[20px] lg:ml-[200px]" />
        </div>

        {/* Illustration card */}
        <div className="flex-1 flex items-center justify-center py-10">
          <img src="loginimage.svg" alt="" className="w-[295px] lg:mt-[60px]" />
        </div>


        

        
            
            

        {/* Title + subtitle */}
        <div className="text-center md:text-left mb-10 lg:ml-[100px]">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 lg:ml-15">
            Visitor Tracker
          </h2>
          <p className="text-slate-400 mt-1 lg:mr-[10px]">
            Ensure Secure Visitor Check-Ins and Approvals
          </p>
        </div>

        {/* Footer */}
        <div>
          <p className="text-xs text-slate-400">
            © 2026 Zoracom. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-16 bg-white">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 p-8">
          <h2 className="text-2xl font-bold text-slate-900">Admin Login</h2>
          <p className="text-sm text-slate-400 mt-1 mb-6">
            Enter your credentials to manage the portal
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@zoracom.com"
                className="w-full rounded-lg bg-slate-100 border border-transparent px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full rounded-lg bg-slate-100 border border-transparent px-4 py-2.5 pr-10 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-sky-400 hover:bg-sky-500 text-white font-semibold py-2.5 mt-2 transition shadow-sm shadow-sky-200"
            >
              Login
            </button>

            <div className="text-center pt-1">
              <a
                href="#"
                className="text-sm text-sky-500 hover:text-sky-600 hover:underline"
              >
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
