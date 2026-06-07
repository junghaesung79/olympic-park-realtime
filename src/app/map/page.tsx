import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "지도",
  description: "집결 장소, 주차/대중교통, 화장실·식수·휴게 공간 위치 안내",
};

const spots = [
  { type: "집결 장소", name: "올림픽공원 평화의광장", note: "메인 집결 지점 (예시)" },
  { type: "주차", name: "공원 제2주차장", note: "임시 통제 가능, 대중교통 권장 (예시)" },
  { type: "대중교통", name: "5호선 올림픽공원역 3번 출구", note: "도보 약 10분 (예시)" },
  { type: "화장실", name: "평화의광장 공중화장실", note: "예시 위치" },
  { type: "식수", name: "체육관 앞 음수대", note: "예시 위치" },
  { type: "휴게 공간", name: "장미광장 그늘막", note: "예시 위치" },
];

export default function MapPage() {
  return (
    <main className="flex flex-1 flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold">지도</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          실시간 집결 장소, 주차/대중교통, 편의시설 위치를 안내합니다. (지도는
          준비 중이며 현재는 예시 데이터입니다)
        </p>
      </header>

      <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        <Image
          src="/map-naver.png"
          alt="올림픽공원 일대 지도 (네이버 지도)"
          width={2940}
          height={1668}
          className="h-auto w-full"
        />
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {spots.map((spot) => (
          <li
            key={spot.name}
            className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {spot.type}
            </span>
            <h2 className="font-semibold">{spot.name}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{spot.note}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
