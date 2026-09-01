export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`w-full bg-white ps-4 py-2 text-left text-[11px] text-black ${className}`}
    >
      Copyright {new Date().getFullYear()} Zoracom. All rights reserved.
    </footer>
  );
}
