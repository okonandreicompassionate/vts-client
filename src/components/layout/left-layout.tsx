import leftLayoutImage from "@/components/layout/left2.svg";

export default function LeftLayout() {
  return (
    <aside className="hidden h-full min-h-screen w-full flex-col bg-[#f5f9f9] px-8 py-8 md:flex md:px-8 md:py-8 lg:px-16 dark:bg-slate-950">
      <img src="/logo.png" alt="VisitorX" className="h-auto w-24 object-contain" />

      <div className="flex flex-1 -translate-y-3 flex-col items-center justify-center px-2 text-center">
        <img
          src={leftLayoutImage}
          alt=""
          className="aspect-[1.37/1] w-[min(100%,34vw)] max-w-md rounded-xl object-contain"
        />
        <div className="mt-4 flex flex-col gap-1.5">
          <h1 className="text-base font-bold tracking-tight text-slate-900 lg:text-xl dark:text-slate-100">
            Visitor management, simplified
          </h1>
          <p className="text-[10px] whitespace-nowrap text-slate-500 dark:text-slate-400">
            A secure, seamless experience from invitation to checkout.
          </p>
        </div>
      </div>
    </aside>
  );
}
