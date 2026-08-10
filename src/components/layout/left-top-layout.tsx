export default function LeftTopLayout() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-10 text-center 2xl:gap-12">
      <img src="/logo.svg" alt="" className="h-20 w-32 2xl:h-24 2xl:w-40" />

      <img
        src="/loginimage.svg"
        alt=""
        className="w-72 object-contain 2xl:w-96"
      />

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-800 md:text-3xl 2xl:text-4xl dark:text-slate-100">
          Visitor Tracker
        </h2>
        <p className="text-slate-400 2xl:text-lg dark:text-slate-400">
          Ensure Secure Visitor Check-Ins and Approvals
        </p>
      </div>
    </div>
  );
}
