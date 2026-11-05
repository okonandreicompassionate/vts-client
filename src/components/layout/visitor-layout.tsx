import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import LeftLayout from "@/components/layout/left-layout";
import Footer from "@/components/layout/footer";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { paths } from "@/config/paths";
import Header from "@/components/layout/mobile-header";
import { ThemeToggle } from "../ui/theme-toggle";

const VisitorLayout = () => {
  const navigate = useNavigate();
  const matchesReview = useMatch(paths.visitorProfile.path);
  const matchesAppointments = useMatch(paths.visitorAppointments.path);
  const isRegistration = Boolean(useMatch(paths.register.path));
  const isReview = Boolean(matchesReview || matchesAppointments);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <div className="grid min-h-0 w-full flex-1 md:grid-cols-2">
        <LeftLayout />

        <div
          className={
            isReview
              ? "mt-4 flex h-full min-h-0 w-full flex-col overflow-y-auto bg-white dark:bg-zinc-900"
              : "flex h-full min-h-0 w-full min-w-0 flex-col overflow-y-auto bg-white pt-4 sm:px-6 md:px-10 lg:px-14 dark:bg-zinc-900"
          }
        >
          <Header />

          <main
            className={
              isReview
                ? "flex w-full flex-1 justify-center px-3 pt-3 pb-5 sm:px-8 sm:pt-8 sm:pb-8"
                : isRegistration
                  ? "flex w-full flex-1 justify-center px-4 py-6 sm:px-6 sm:py-8 md:px-10"
                  : "flex min-h-0 w-full flex-1 justify-center pt-6 sm:pt-8 md:items-center md:pt-0"
            }
          >
            <div className={isReview ? "w-full max-w-[600px]" : "w-full max-w-md"}>
              <div className="absolute top-4 right-4 z-10">
                <ThemeToggle />
              </div>

              <Outlet />

              <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                className="mt-3 mb-12 w-full place-self-center px-0! text-white hover:text-white/80 dark:text-zinc-400 dark:hover:text-zinc-300"
              >
                Back
              </Button>
            </div>
          </main>
        </div>
      </div>

      <Footer className="hidden md:block" />
    </div>
  );
};

export default VisitorLayout;
