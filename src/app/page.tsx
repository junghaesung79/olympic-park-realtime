import Link from "next/link";

const staticInfo = [
  {
    href: "/info/safety",
    title: "행동 수칙 · 준비물",
    description: "현장 참여 시 안전을 위한 행동 수칙 안내",
  },
  {
    href: "/info/emergency",
    title: "비상 연락망 (준비 중)",
    description: "응급 상황 발생 시 연락할 수 있는 번호와 위치 안내",
    disabled: true,
  },
];

const featured = [
  {
    href: "/share",
    title: "실시간 정보 공유 (준비 중)",
    description: "현장 상황을 실시간으로 공유하고 확인할 수 있습니다.",
    disabled: true,
  },
  {
    href: "/map",
    title: "지도",
    description: "올림픽공원 주변 지역 지도와 핸드볼경기장 출입구 안내",
  },
  {
    href: "/links",
    title: "라이브스트림 · SNS (준비 중)",
    description: "도움이 되는 SNS 계정 모음",
    disabled: true,
  },
  {
    href: "/feedback",
    title: "정보 수정 요청 · 문의사항",
    description: "잘못된 정보 수정 요청이나 궁금한 점을 남겨주세요",
  },
];

export default function Home() {
  return (
    <main className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="flex flex-col gap-10">
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
                {item.disabled ? (
                  <div className="flex items-center justify-between gap-4 py-4 text-zinc-400 dark:text-zinc-600 cursor-not-allowed select-none">
                    <span>
                      <span className="font-medium">{item.title}</span>
                      <span className="mt-0.5 block text-sm text-zinc-500">
                        {item.description}
                      </span>
                    </span>
                    <span className="text-zinc-300 dark:text-zinc-700">→</span>
                  </div>
                ) : (
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
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="flex flex-col gap-4">
        {featured.map((card) =>
          card.disabled ? (
            <div
              key={card.href}
              className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed select-none"
            >
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="mt-1 text-sm text-zinc-500">
                {card.description}
              </p>
            </div>
          ) : (
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
          )
        )}
      </section>
    </main>
  );
}
