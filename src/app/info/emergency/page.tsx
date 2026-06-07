import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "비상 연락망",
  description: "응급 상황 발생 시 연락할 수 있는 번호와 위치 안내",
};

export default async function EmergencyPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const isLocal =
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("[::1]");

  if (!isLocal) {
    redirect("/");
  }

  return (
    <main className="flex flex-1 flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold">비상 연락망</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          준비 중입니다. 확인된 정보가 마련되는 대로 안내해 드리겠습니다.
        </p>
      </header>
    </main>
  );
}
