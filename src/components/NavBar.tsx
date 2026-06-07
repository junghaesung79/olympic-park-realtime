import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "홈" },
  { href: "/map", label: "지도" },
  { href: "/info/safety", label: "행동 수칙" },
  { href: "/info/emergency", label: "응급 의료" },
  { href: "/info/weather", label: "기상 대응" },
  { href: "/links", label: "라이브·SNS" },
];

export default function NavBar() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <ThemeToggle />
      </nav>
    </header>
  );
}
