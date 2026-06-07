import type { Metadata } from "next";
import Checklist from "./Checklist";

export const metadata: Metadata = {
  title: "행동 수칙 · 준비물",
  description: "현장 참여 시 지켜야 할 행동 수칙과 준비물 안내",
};

const locationNotice = [
  "출처가 불분명한 글이나 SNS 메시지에는 사실과 다른 내용이 섞여 있을 수 있습니다. 가짜 정보에 휩쓸려 무리한 행동을 하지 말고, 확인되지 않은 내용은 퍼뜨리지 말아 주세요.",
  "특히 온라인에는 서로 다른 장소를 집결지로 지목하는 정보가 동시에 떠도는 경우가 있습니다. 이동하기 전에 여러 출처로 사실 여부를 확인해 주세요.",
  "이 페이지는 실시간 현장 정보를 반영하지 않는 일반 안내입니다. 집결 장소나 인파 상황처럼 시점에 따라 달라지는 정보는 라이브·SNS 페이지나 현장 공지에서 확인해 주세요.",
];

const guidelines = [
  "집결 장소 인근에 다른 행사(공연 등)가 있다면, 펜스나 안내선이 보이는 구역에는 들어가지 않도록 주의합니다.",
  "장시간 자리를 지킬 수 있으니, 체류 시간을 염두에 두고 미리 준비합니다.",
  "인파가 몰리는 좁은 통로나 출입구 부근은 피하고, 밀집 구역에 무리하게 들어가지 않습니다.",
  "어지럼증이나 압박감을 느끼면 즉시 가장자리나 트인 곳으로 이동해 주변에 알립니다.",
  "경찰과 대치하는 상황에서는 자극적인 언행이나 충돌을 피하고 침착하게 행동합니다.",
  "타인을 향한 폭력적 언행이나 물리적 충돌을 하지 않습니다.",
  "사진·영상 촬영 시 타인의 얼굴이 드러나지 않도록 주의합니다.",
];

const transport = [
  "인근 주차장은 만차가 되기 쉽고 주변 도로가 정체될 수 있으니, 자가용보다 대중교통(지하철 5·9호선 올림픽공원역) 이용을 권장합니다.",
  "올림픽공원역 3번 출구에서 도보 약 10분 거리입니다.",
];

const checklist = [
  "마실 물과 간단한 간식",
  "위생용품",
  "보조배터리, 손전등",
  "보온·방한용 겉옷 (야간에는 기온이 떨어집니다)",
  "휴대용 방석 또는 깔개 (장시간 대기 대비)",
  "편한 신발과 여벌 옷, 우산 또는 우비",
];

export default function SafetyPage() {
  return (
    <main className="flex flex-1 flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold">행동 수칙 · 준비물</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          안전한 참여를 위해 아래 내용을 미리 확인해 주세요. 시점에 따라 달라지는
          현장 정보는 라이브·SNS 페이지에서 확인하시기 바랍니다.
        </p>
      </header>

      <section className="rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="text-lg font-semibold">정보 확인 안내</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          {locationNotice.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">참여 시 지켜야 할 행동 수칙</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          {guidelines.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">오가는 길</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          {transport.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">준비물 체크리스트</h2>
        <Checklist items={checklist} />
      </section>
    </main>
  );
}
