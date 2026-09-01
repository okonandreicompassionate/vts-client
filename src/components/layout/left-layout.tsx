export default function LeftLayout() {
  return (
    <aside className="hidden h-full min-h-0 items-center w-full overflow-hidden bg-[#EFF7FB] px-8 pt-10 md:grid md:px-16 md:pt-12 dark:bg-slate-800">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 text-center 2xl:gap-10">
        <img src="/logo.svg" alt="" className="h-20 w-32 2xl:h-24 2xl:w-40" />

        <img
          src="/left-layout-img.png"
          alt=""
          className="w-72 object-contain 2xl:w-96 border-0! outline-none! shadow-none!"
        />

        <div className="flex flex-col gap-2">
          <h2 className="text-[20px] font-bold text-slate-800 md:text-2xl 2xl:text-3xl dark:text-slate-100">
            Visitor Tracker
          </h2>
          <p className="text-slate-400 md:text-base 2xl:text-[16px] dark:text-slate-400">
            Ensure Secure Visitor Check-Ins and Approvals
          </p>
        </div>
      </div>
    </aside>
  );
}