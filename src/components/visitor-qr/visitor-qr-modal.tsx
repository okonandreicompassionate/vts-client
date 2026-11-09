import { CopyOutlined, DownloadOutlined, PrinterOutlined, QrcodeOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

import CustomModal from "@/components/ui/custom-modal";
import { Spinner } from "@/components/ui/spinner";
import { paths } from "@/config/paths";
import { useGetProfileQuery } from "@/lib/auth/profile-api";
import { downloadPosterPng } from "./download-poster-png";
import { QR_IMAGE } from "./poster-content";
import VisitorQrPoster from "./visitor-qr-poster";

/**
 * The gate poster: visitors scan it to open the organization's visitor form.
 * Print it, download it as a PNG, or copy the link.
 * Open with `openModal(<VisitorQrModal />)`.
 */
export default function VisitorQrModal() {
  const { data: profile, isLoading } = useGetProfileQuery();
  const qrCanvas = useRef<HTMLCanvasElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const orgSlug = profile?.organization?.slug ?? profile?.orgSlug;
  const orgName = profile?.organization?.name ?? "our office";
  const url = orgSlug ? `${window.location.origin}${paths.home.getHref(orgSlug)}` : "";

  const handleDownload = async () => {
    if (!qrCanvas.current || !orgSlug) return;
    setIsDownloading(true);
    try {
      await downloadPosterPng({
        orgName,
        url,
        qrCanvas: qrCanvas.current,
        fileName: `${orgSlug}-visitor-qr.png`,
      });
    } catch {
      message.error("The poster could not be downloaded. Try printing it instead.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      message.success("Visitor link copied.");
    } catch {
      message.error("The link could not be copied.");
    }
  };

  return (
    <CustomModal size="lg">
      <CustomModal.Header
        title="Visitor QR code"
        subtitle="Print this at the gate. Visitors scan it to register their visit."
        icon={<QrcodeOutlined />}
        tone="sky"
      />

      <CustomModal.Body>
        {isLoading || !orgSlug ? (
          <div className="flex justify-center py-16">
            {isLoading ? (
              <Spinner variant="inline" />
            ) : (
              <p className="text-sm text-slate-500">Your organization's link is not available.</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-full max-w-[300px] overflow-hidden rounded-lg border border-slate-200 shadow-sm dark:border-zinc-700">
              <VisitorQrPoster orgName={orgName} url={url} />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <Button
                icon={<DownloadOutlined />}
                loading={isDownloading}
                onClick={() => void handleDownload()}
              >
                Download PNG
              </Button>
              <Button icon={<CopyOutlined />} onClick={() => void handleCopy()}>
                Copy link
              </Button>
            </div>

            {/* High-resolution source for the PNG; not shown. */}
            <QRCodeCanvas
              ref={qrCanvas}
              value={url}
              size={1024}
              level="H"
              marginSize={0}
              fgColor="#10241C"
              imageSettings={{ ...QR_IMAGE, height: 180, width: 180 }}
              className="hidden"
            />

            {/* What window.print() prints: the poster alone on an A4 page (see index.css). */}
            {createPortal(
              <div className="visitor-qr-print">
                <VisitorQrPoster orgName={orgName} url={url} />
              </div>,
              document.body,
            )}
          </div>
        )}
      </CustomModal.Body>

      <CustomModal.Footer
        okText={
          <>
            <PrinterOutlined /> Print poster
          </>
        }
        cancelText="Close"
        disabled={!orgSlug}
        onOk={() => window.print()}
      />
    </CustomModal>
  );
}
