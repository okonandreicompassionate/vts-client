import leftLayoutImage from "/login-image.png";

export default function LeftLayout() {
  return (
    <aside className="relative hidden h-full min-h-0 w-full flex-col overflow-y-auto bg-linear-to-br from-blue-100 via-orange-100 to-green-100 px-8 py-8 md:flex md:px-10 lg:px-16 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Dark mode: soft brand glows stand in for the pastel gradient. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden dark:block">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative my-auto flex w-full shrink-0 flex-col items-center text-center">
        <img src="/logo.svg" alt="GuestX" className="mb-12 h-auto w-48 object-contain" />

        <div className="w-full max-w-[430px] overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-700">
          {/* The screenshot has dark text on a transparent background, so its frame stays white. */}
          <div className="bg-white pt-6">
            <img
              src={leftLayoutImage}
              alt="visitor management system"
              className="h-auto w-full object-contain dark:brightness-95"
            />
          </div>

          <div className="border-t border-slate-200 bg-white/80 px-12 py-6 backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/90">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 lg:text-xl dark:text-zinc-100">
              Visitor management, simplified
            </h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              A secure, seamless experience from invitation to checkout.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
