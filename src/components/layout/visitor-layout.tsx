import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import LeftLayout from "@/components/layout/left-layout";
import Footer from "@/components/layout/footer";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "@/components/layout/mobile-header";
import { ThemeToggle } from "../ui/theme-toggle";

const VisitorLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex min-h-0 w-full flex-1 md:flex-row">
        <LeftLayout />

        <div className="mt-4 flex min-h-screen w-full flex-col bg-white sm:px-6 md:px-10 lg:px-14 dark:bg-slate-900">
          <Header />

          <main className="flex min-h-0 w-full flex-1 justify-center px-4 pt-6 sm:px-6 sm:pt-8 md:items-center md:px-10 md:pt-0">
            <div className="w-full max-w-md">
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              className="px-0! text-sky-500!"
            >
              Back
            </Button>

            <div className="absolute top-4 right-4 z-10">
              <ThemeToggle />
            </div>

              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <Footer className="hidden md:block" />
    </div>
  );
};

export default VisitorLayout;
