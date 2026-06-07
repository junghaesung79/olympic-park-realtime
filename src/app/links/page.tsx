const streams = [
  { label: "공식 라이브스트림 (예시)", url: "https://example.com/live" },
];

const sns = [
  { label: "공식 트위터/X (예시)", url: "https://example.com/x" },
  { label: "공식 인스타그램 (예시)", url: "https://example.com/instagram" },
  { label: "공식 텔레그램 채널 (예시)", url: "https://example.com/telegram" },
];

export default function LinksPage() {
  return (
    <main className="flex flex-1 flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold">라이브스트림 · SNS 모음</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          공식 채널만 모았습니다. 출처가 불분명한 계정의 정보는 주의해 주세요.
          (예시 링크이며 추후 확인된 공식 채널로 교체될 예정입니다)
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold">라이브스트림</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {streams.map((item) => (
            <li key={item.url}>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-md border border-zinc-200 px-3 py-2 text-blue-600 hover:underline dark:border-zinc-800 dark:text-blue-400"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">공식 SNS 계정</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {sns.map((item) => (
            <li key={item.url}>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-md border border-zinc-200 px-3 py-2 text-blue-600 hover:underline dark:border-zinc-800 dark:text-blue-400"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
