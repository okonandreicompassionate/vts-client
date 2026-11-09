export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`w-full bg-white ps-4 py-1 text-left text-[11px] text-slate-600 ${className} dark:bg-zinc-900 dark:text-zinc-400`}
    >
      GuestX © {new Date().getFullYear()}. All rights reserved.
    </footer>
  );
}
