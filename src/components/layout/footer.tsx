export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`w-full bg-white ps-4 py-1 text-left text-[11px] text-slate-600 ${className}`}
    >
      Copyright {new Date().getFullYear()} Zoracom. All rights reserved.
    </footer>
  );
}
