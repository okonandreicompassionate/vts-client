import { QRCodeSVG } from "qrcode.react";

import { POSTER_STEPS, QR_IMAGE } from "./poster-content";

/**
 * The gate poster: an A4 page. Every size is a share of the poster's width
 * (container units), so the same markup is the on-screen preview and the print.
 * Always light: it's printed.
 */
export default function VisitorQrPoster({ orgName, url }: { orgName: string; url: string }) {
  return (
    <div className="@container w-full">
      <div className="relative flex aspect-[210/297] w-full flex-col items-center overflow-hidden bg-white text-[#10241C] [print-color-adjust:exact]">
        {/* Brand band */}
        <div className="flex h-[3cqw] w-full">
          <span className="flex-1 bg-[#08A7E0]" />
          <span className="w-[22cqw] bg-[#F56812]" />
        </div>

        <img src="/logo.svg" alt="GuestX" className="mt-[7cqw] h-[6cqw] w-auto" />

        <p className="mt-[5cqw] text-[3cqw] font-semibold tracking-[0.3em] text-[#08A7E0] uppercase">
          Visitor check-in
        </p>
        <h1 className="mt-[1.5cqw] px-[8cqw] text-center text-[6.4cqw] leading-tight font-bold">
          Welcome to {orgName}
        </h1>
        <p className="mt-[1.5cqw] text-[3.2cqw] text-[#10241C]/65">
          Scan to register your visit
        </p>

        <div className="mt-[5cqw] rounded-[4cqw] border-[0.5cqw] border-[#08A7E0]/25 bg-white p-[4cqw] shadow-[0_1cqw_4cqw_rgba(8,167,224,0.15)]">
          <QRCodeSVG
            value={url}
            size={512}
            level="H"
            marginSize={0}
            fgColor="#10241C"
            imageSettings={QR_IMAGE}
            title={`Visitor check-in for ${orgName}`}
            style={{ width: "42cqw", height: "42cqw", display: "block" }}
          />
        </div>

        <ol className="mt-[6cqw] flex w-[76cqw] flex-col gap-[2.2cqw]">
          {POSTER_STEPS.map((step, index) => (
            <li key={step} className="flex items-center gap-[2.5cqw] text-[2.9cqw]">
              <span className="flex h-[5cqw] w-[5cqw] shrink-0 items-center justify-center rounded-full bg-[#08A7E0] text-[2.6cqw] font-bold text-white">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <div className="mt-auto mb-[6cqw] flex flex-col items-center gap-[0.8cqw]">
          <span className="text-[2.3cqw] text-[#10241C]/55">No camera? Open this link:</span>
          <span className="rounded-full bg-[#08A7E0]/10 px-[3cqw] py-[1cqw] font-mono text-[2.5cqw] font-medium break-all text-[#0784b2]">
            {url.replace(/^https?:\/\//, "")}
          </span>
        </div>
      </div>
    </div>
  );
}
