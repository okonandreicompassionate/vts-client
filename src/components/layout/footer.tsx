export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`w-full bg-white px-4 pt-8 pb-4 text-center text-[10px] text-black ${className}`}
    >
      Copyright {new Date().getFullYear()} Zoracom. All rights reserved.
    </footer>
  );
}
