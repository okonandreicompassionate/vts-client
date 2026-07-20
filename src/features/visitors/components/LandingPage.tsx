import { Button } from "antd";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex w-full max-w-xl flex-col rounded-xl max-md:p-4">
        <header className="-mt-32 mb-20 flex flex-col items-center text-center md:mt-4">
          <div className="flex flex-col items-center gap-2">
            <img src="/logo.png" alt="Zoracom" className="mb-2 h-8 w-auto" />
            <h1 className="text-xl font-semibold text-gray-600 md:text-2xl">
              Visitor Tracking System
            </h1>
          </div>
        </header>

        {/* <div className="text-center mb-2">
          <p className="text-2xl font-semibold text-[#262626]">Welcome to</p>
          <p className="mt-2 text-[14px] leading-relaxed text-[#262626]">
            Secure visitor check-in and approval made simple
          </p>
        </div> */}

        <div className="space-y-4 rounded-xl bg-white/20 p-3 backdrop-blur-sm md:p-6 md:shadow-xl">
          <img
            src="/nsoc-building.png"
            alt="Zoracom building"
            className="h-auto w-full max-w-full rounded-xl object-cover"
          />

          <Button
            type="primary"
            size="large"
            block
            onClick={() => navigate("/verify")}
            className="h-12 rounded-lg font-semibold"
            icon={<ArrowRight size={18} />}
            iconPlacement="end"
          >
            Get Started
          </Button>
        </div>
      </div>

      <div className="fixed bottom-0 -z-10 w-screen rounded-t-[50px] bg-green-500/20 max-md:h-[50vh] md:h-[40vh] md:rounded-t-full"></div>
    </div>
  );
}
