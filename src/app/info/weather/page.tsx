import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "기상 정보 · 대응",
  description: "우천·혹서·한파 등 기상 상황별 대응 요령 안내",
};

const conditions = [
  {
    title: "우천 시",
    tips: [
      "우비나 우산을 준비하고, 바닥이 미끄러운 구역을 주의하세요.",
      "전자기기는 방수 보관에 신경 쓰세요.",
      "천둥·번개 시 실내 대피 공간으로 이동하세요.",
    ],
  },
  {
    title: "혹서기",
    tips: [
      "그늘막과 휴게 공간을 적극 활용하고 충분히 휴식하세요.",
      "수분과 염분을 주기적으로 섭취하세요.",
      "어지러움 등 온열 질환 증상 시 즉시 의료 지원을 요청하세요.",
    ],
  },
  {
    title: "한파 시",
    tips: [
      "보온 의류와 핫팩 등을 미리 준비하세요.",
      "장시간 야외 체류를 피하고 따뜻한 휴게 공간을 이용하세요.",
    ],
  },
];

export default function WeatherPage() {
  return (
    <main className="flex flex-1 flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold">기상 정보 · 대응 안내</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          현재 기상 상황과 상황별 대응 요령을 확인하세요. (예시 콘텐츠이며
          추후 실시간 기상 데이터 연동 예정입니다)
        </p>
      </header>

      <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-6 text-center text-sm text-zinc-400 dark:border-zinc-700">
        실시간 날씨 위젯 영역 (추후 연동 예정)
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {conditions.map((condition) => (
          <div
            key={condition.title}
            className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <h2 className="font-semibold">{condition.title}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-700 dark:text-zinc-300">
              {condition.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
