export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`w-full py-1 text-center text-[11px] text-slate-500 dark:text-slate-400 ${className}`}
    >
      Copyright {new Date().getFullYear()} Zoracom. All rights reserved.
    </footer>
  );
}
