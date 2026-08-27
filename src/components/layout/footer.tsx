export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`w-full text-center text-[10px] text-slate-500 dark:text-slate-400 ${className}`}
    >
      Copyright {new Date().getFullYear()} Zoracom. All rights reserved.
    </footer>
  );
}
