
import { Button } from "antd";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white px-6 pb-8 pt-12">
      
      <header className="flex flex-col items-center text-center">
        <img src="/logo.svg" alt="Zoracom" className="mb-8 h-6 w-auto" />

        <p className="text-[15px] text-[#262626]">Welcome to</p>
        <h1 className="mt-1 text-[28px] font-bold text-[#00AFEF]">
          Visitor Tracker
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[#262626]">
          Secure visitor check-in and approval made simple
        </p>
      </header>

    
      <div className="mt-8 overflow-hidden rounded-2xl bg-[#F5F8FA] p-2">
        <img
          src="/nsoc-building.png"
          alt="Zoracom building"
          className="h-50 w-full rounded-xl object-cover"
        />
      </div>

      
      <div className="flex-1" />

     
      <Button
        type="primary"
        size="large"
        block
        onClick={() => navigate("/verify")}
        className="rounded-lg text-[15px] font-semibold"
        icon={<ArrowRight size={18} />}
        iconPlacement="end"
      >
        Get Started
      </Button>
    </div>
  );
}