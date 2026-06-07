import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "행동 수칙 · 준비물",
  description: "현장 참여 시 지켜야 할 행동 수칙과 준비물 안내",
};

const guidelines = [
  "주최 측 안내에 따라 행동하고, 지정된 구역을 벗어나지 않습니다.",
  "타인을 향한 폭력적 언행이나 물리적 충돌을 하지 않습니다.",
  "현장 사진·영상 촬영 시 타인의 얼굴이 노출되지 않도록 주의합니다.",
  "응급 상황 발생 시 가까운 진행 요원이나 의료 지원 부스에 알립니다.",
];

const checklist = [
  "신분증, 비상 연락처 메모",
  "마실 물과 간단한 간식",
  "모자, 마스크, 손소독제",
  "보조배터리, 우산 또는 우비",
  "편한 신발과 여벌 옷",
];

export default function SafetyPage() {
  return (
    <main className="flex flex-1 flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold">행동 수칙 · 준비물</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          안전한 참여를 위해 아래 내용을 미리 확인해 주세요. (예시 콘텐츠이며
          추후 주최 측 공식 안내로 교체될 예정입니다)
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold">참여 시 지켜야 할 행동 수칙</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          {guidelines.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">준비물 체크리스트</h2>
        <ul className="mt-3 grid grid-cols-1 gap-2 text-sm text-zinc-700 sm:grid-cols-2 dark:text-zinc-300">
          {checklist.map((item) => (
            <li
              key={item}
              className="rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
