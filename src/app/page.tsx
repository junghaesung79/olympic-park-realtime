import Link from "next/link";

const featured = [
  {
    href: "/map",
    title: "지도",
    description: "집결 장소, 주차/대중교통, 화장실·식수·휴게 공간 위치",
  },
  {
    href: "/links",
    title: "라이브스트림 · SNS",
    description: "공식 라이브 방송과 SNS 계정 모음",
  },
];

const staticInfo = [
  {
    href: "/info/safety",
    title: "행동 수칙 · 준비물",
    description: "참여 방법과 현장에서 지켜야 할 수칙을 안내합니다",
  },
  {
    href: "/info/emergency",
    title: "응급 의료 지원",
    description: "응급 상황 시 위치와 연락처를 확인하세요",
  },
  {
    href: "/info/weather",
    title: "기상 정보 · 대응",
    description: "우천·혹서 등 기상 상황별 대응 안내",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col gap-8 lg:flex-row lg:items-start">
      <div className="flex flex-1 flex-col gap-10">
        <section>
          <h1 className="text-3xl font-bold">올림픽공원 실시간 정보</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            현장 참여자와 동참을 원하는 분들을 위한 정보를 제공합니다.<br />
            이 사이트에 있는 정보 또한 사실이 아닐 수도 있습니다.<br />
            자신과 주변 사람들의 안전을 최우선으로 생각해주세요.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">정보</h2>
          <ul className="mt-3 divide-y divide-zinc-200 dark:divide-zinc-800">
            {staticInfo.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between gap-4 py-4 transition hover:text-zinc-950 dark:hover:text-zinc-50"
                >
                  <span>
                    <span className="font-medium">{item.title}</span>
                    <span className="mt-0.5 block text-sm text-zinc-600 dark:text-zinc-400">
                      {item.description}
                    </span>
                  </span>
                  <span className="text-zinc-400">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="flex flex-col gap-4 lg:w-80 lg:shrink-0">
        {featured.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg border border-zinc-200 p-5 transition hover:border-zinc-400 hover:shadow-sm dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <h2 className="text-lg font-semibold">{card.title}</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {card.description}
            </p>
          </Link>
        ))}
      </section>
    </main>
  );
}
