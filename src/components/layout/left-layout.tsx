import leftLayoutImage from "@/components/layout/left2.svg";

export default function LeftLayout() {
  return (
    <aside className="hidden h-full min-h-screen w-full flex-col bg-[#f5f9f9] px-8 py-8 md:flex md:px-10 md:py-8 lg:px-16 dark:bg-slate-950">
      <img src="/logo.png" alt="VisitorX" className="h-auto w-28 object-contain" />

      <div className="flex flex-1 -translate-y-3 flex-col items-center justify-center px-2 text-center">
        <div className="w-full max-w-2xl rounded-3xl bg-[#e7f6fa] px-5 py-7 sm:px-8 lg:px-5">
          <img
            src={leftLayoutImage}
            alt=""
            className="mx-auto aspect-[1.37/1] w-full max-w-xl object-contain"
          />
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 lg:text-2xl dark:text-slate-100">
            Visitor management, simplified
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A secure, seamless experience from invitation to checkout.
          </p>
        </div>
      </div>
    </aside>
  );
}
