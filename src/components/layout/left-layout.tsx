import Footer from "./footer";
import LeftTopLayout from "./left-top-layout";

export default function LeftLayout() {
  return (
    <aside className="hidden min-h-screen items-center w-full grid-rows-[minmax(0,1fr)_auto] gap-8 overflow-hidden bg-[#EFF7FB] px-8 pt-10 md:grid md:px-16 md:pt-12 dark:bg-slate-800">
      <div>
        <LeftTopLayout />
      </div>

      <Footer className="w-full -ml-8 text-left md:-ml-16" />
    </aside>
  );
}