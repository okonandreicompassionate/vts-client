import { POSTER_STEPS } from "./poster-content";

// A4 at 150 dpi. `u` is 1% of the width, like the poster's cqw units.
const WIDTH = 1240;
const HEIGHT = 1754;
const u = WIDTH / 100;
const INK = "#10241C";
const BRAND = "#08A7E0";
const FONT = '"Raleway Variable", Arial, sans-serif';

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

/** Splits text into lines that fit `maxWidth` with the current font. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  return [...lines, line];
}

/** Draws the gate poster (same layout as VisitorQrPoster) and downloads it as a PNG. */
export async function downloadPosterPng({
  orgName,
  url,
  qrCanvas,
  fileName,
}: {
  orgName: string;
  url: string;
  qrCanvas: HTMLCanvasElement;
  fileName: string;
}) {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported.");

  const center = WIDTH / 2;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Brand band.
  ctx.fillStyle = BRAND;
  ctx.fillRect(0, 0, WIDTH - 22 * u, 3 * u);
  ctx.fillStyle = "#F56812";
  ctx.fillRect(WIDTH - 22 * u, 0, 22 * u, 3 * u);

  const logo = await loadImage("/logo.svg");
  const logoHeight = 6 * u;
  const logoWidth = (logo.naturalWidth / logo.naturalHeight || 630 / 165) * logoHeight;
  ctx.drawImage(logo, center - logoWidth / 2, 10 * u, logoWidth, logoHeight);

  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  ctx.fillStyle = BRAND;
  ctx.font = `600 ${3 * u}px ${FONT}`;
  ctx.letterSpacing = `${0.9 * u}px`;
  ctx.fillText("VISITOR CHECK-IN", center, 21 * u);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = INK;
  ctx.font = `700 ${6.4 * u}px ${FONT}`;
  let y = 25.5 * u;
  for (const line of wrap(ctx, `Welcome to ${orgName}`, 84 * u)) {
    ctx.fillText(line, center, y);
    y += 8 * u;
  }

  ctx.globalAlpha = 0.65;
  ctx.font = `400 ${3.2 * u}px ${FONT}`;
  ctx.fillText("Scan to register your visit", center, y + 1 * u);
  ctx.globalAlpha = 1;
  y += 9.5 * u;

  // QR card.
  const qrSize = 42 * u;
  const card = qrSize + 8 * u;
  ctx.beginPath();
  ctx.roundRect(center - card / 2, y, card, card, 4 * u);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 0.5 * u;
  ctx.strokeStyle = "rgba(8, 167, 224, 0.25)";
  ctx.stroke();
  ctx.drawImage(qrCanvas, center - qrSize / 2, y + 4 * u, qrSize, qrSize);
  y += card + 6 * u;

  // Steps.
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const left = 12 * u;
  for (const [index, step] of POSTER_STEPS.entries()) {
    const middle = y + 2.5 * u;
    ctx.beginPath();
    ctx.arc(left + 2.5 * u, middle, 2.5 * u, 0, Math.PI * 2);
    ctx.fillStyle = BRAND;
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 ${2.6 * u}px ${FONT}`;
    ctx.textAlign = "center";
    ctx.fillText(String(index + 1), left + 2.5 * u, middle);
    ctx.textAlign = "left";
    ctx.fillStyle = INK;
    ctx.font = `400 ${2.9 * u}px ${FONT}`;
    ctx.fillText(step, left + 7.5 * u, middle);
    y += 7.2 * u;
  }

  // Fallback link.
  ctx.textAlign = "center";
  const link = url.replace(/^https?:\/\//, "");
  ctx.font = `500 ${2.5 * u}px ui-monospace, Menlo, Consolas, monospace`;
  const pillWidth = Math.min(ctx.measureText(link).width + 6 * u, 92 * u);
  const pillTop = HEIGHT - 6 * u - 4.5 * u;
  ctx.beginPath();
  ctx.roundRect(center - pillWidth / 2, pillTop, pillWidth, 4.5 * u, 2.25 * u);
  ctx.fillStyle = "rgba(8, 167, 224, 0.1)";
  ctx.fill();
  ctx.fillStyle = "#0784b2";
  ctx.fillText(link, center, pillTop + 2.25 * u, 88 * u);

  ctx.globalAlpha = 0.55;
  ctx.fillStyle = INK;
  ctx.font = `400 ${2.3 * u}px ${FONT}`;
  ctx.fillText("No camera? Open this link:", center, pillTop - 2.2 * u);
  ctx.globalAlpha = 1;

  const anchor = document.createElement("a");
  anchor.href = canvas.toDataURL("image/png");
  anchor.download = fileName;
  anchor.click();
}
