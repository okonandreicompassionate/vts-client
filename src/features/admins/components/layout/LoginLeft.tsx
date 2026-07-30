
const LoginLeft = () => {
  return (
    <div>
           <div className="relative flex w-full flex-col justify-between overflow-hidden bg-[#EFF7FB] from-sky-50 to-white px-4 py-8 sm:px-6 md:w-1/2 md:px-16 md:py-12">
                <div className="pointer-events-none absolute -top-10 right-0 left-0 h-24" />
        
                {/* Logo */}
                <div>
                  <img
                    src="/logo.svg"
                    alt=""
                    className="w-[125px] lg:mt-[00px] lg:-mb-[200px] lg:ml-[200px]"
                  />
                </div>
        
                {/* Illustration */}
                <div className="flex flex-1 items-center justify-center py-10">
                  <img src="loginimage.svg" alt="" className="w-[295px] lg:mt-[60px]" />
                </div>
        
                {/* Title + subtitle */}
                <div className="mb-10 text-center md:text-left lg:ml-[100px]">
                  <h2 className="text-2xl font-bold text-slate-800 md:text-3xl lg:ml-15">
                    Visitor Tracker
                  </h2>
                  <p className="mt-1 text-slate-400 lg:mr-[10px]">
                    Ensure Secure Visitor Check-Ins and Approvals
                  </p>
                </div>
        
                {/* Footer */}
                <div>
                  <p className="mt-8 text-xs text-slate-400">© 2026 Zoracom. All Rights Reserved.</p>
                </div>
              </div>
      
    </div>
  )
}

export default LoginLeft
