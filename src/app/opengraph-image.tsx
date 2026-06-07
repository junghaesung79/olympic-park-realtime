import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const fontBold = await readFile(
    path.join(process.cwd(), "public/fonts/Pretendard-Bold.otf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#171717",
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            fontFamily: "Pretendard",
          }}
        >
          올림픽공원 실시간 정보
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Pretendard", data: fontBold, weight: 700 as const }],
    }
  );
}
