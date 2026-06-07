import type { Metadata } from "next";
import MapViewer from "./MapViewer";

export const metadata: Metadata = {
  title: "지도",
  description: "올림픽공원 주변 지역 지도와 핸드볼경기장 좌석 및 출입구 안내",
};

export default function MapPage() {
  return (
    <main className="flex flex-1 flex-col gap-6">
      <MapViewer />
    </main>
  );
}
