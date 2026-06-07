const contacts = [
  { label: "긴급 신고", value: "119 (소방·구급) / 112 (경찰)" },
  { label: "현장 응급의료 부스", value: "평화의광장 본부석 옆 (예시 위치)" },
  { label: "현장 안전 핫라인", value: "02-0000-0000 (예시 번호)" },
];

const tips = [
  "어지러움, 호흡 곤란 등 증상이 있으면 즉시 주변에 알리고 그늘로 이동하세요.",
  "혹서기에는 충분한 수분을 섭취하고, 무리하게 장시간 머무르지 마세요.",
  "타인의 응급 상황을 목격하면 임의로 이동시키지 말고 의료 지원 인력을 호출하세요.",
];

export default function EmergencyPage() {
  return (
    <main className="flex flex-1 flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold">응급 의료 지원</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          응급 상황 발생 시 아래 정보를 참고하세요. (예시 콘텐츠이며 추후 현장
          확인된 정보로 교체될 예정입니다)
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold">연락처 · 위치</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {contacts.map((contact) => (
            <li
              key={contact.label}
              className="flex flex-col gap-0.5 rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800"
            >
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {contact.label}
              </span>
              <span className="text-zinc-800 dark:text-zinc-200">{contact.value}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">응급 상황 대응 안내</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          {tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
