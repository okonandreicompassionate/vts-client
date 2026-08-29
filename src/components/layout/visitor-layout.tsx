import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import LeftLayout from "@/components/layout/left-layout";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "@/components/layout/brand-header";


const VisitorLayout = () => {

  const navigate = useNavigate();


  return (
    <div className="flex min-h-screen w-full md:flex-row">
      <LeftLayout />

      <div className="mt-4 flex min-h-screen w-full flex-col bg-white sm:px-6 md:px-10 lg:px-14 dark:bg-slate-900">
        <Header />

        <main className="flex min-h-0 w-full flex-1 justify-center px-4 pt-6 sm:px-6 sm:pt-8 md:items-center md:px-10 md:pt-0">
          <div className="w-full max-w-md">
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              className="mb-1 px-0! text-sky-500!"
            >
              Back
            </Button>

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default VisitorLayout;
