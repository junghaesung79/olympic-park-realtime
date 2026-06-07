import type { Metadata } from "next";
import FeedbackForm from "./FeedbackForm";

export const metadata: Metadata = {
  title: "정보 수정 요청 · 문의사항",
  description: "사이트 정보 수정 요청과 문의사항을 남길 수 있는 페이지",
};

export default function FeedbackPage() {
  return (
    <main className="flex flex-1 flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold">정보 수정 요청 · 문의사항</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          사이트에 게시된 정보의 오류·수정 요청과, 그 외 문의사항을 아래
          양식으로 남겨주세요.
        </p>
      </header>

      <FeedbackForm />
    </main>
  );
}
