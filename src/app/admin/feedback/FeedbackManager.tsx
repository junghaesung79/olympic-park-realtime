"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function FeedbackManager() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch initial feedbacks
    const fetchFeedbacks = async () => {
      try {
        const { data, error } = await supabase
          .from("feedbacks")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setFeedbacks(data || []);
      } catch (err: any) {
        console.error("Detailed error fetching feedbacks:", err);
        setErrorMsg(
          err.message ||
          (err.details ? `${err.message} (${err.details})` : JSON.stringify(err)) ||
          "알 수 없는 에러가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();

    // 2. Subscribe to DB Realtime Changes
    const channel = supabase
      .channel("admin-feedback-page-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feedbacks" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setFeedbacks((current) => [payload.new, ...current]);
          } else if (payload.eventType === "DELETE") {
            setFeedbacks((current) =>
              current.filter((f) => f.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDeleteFeedback = async (id: string) => {
    const { error } = await supabase.from("feedbacks").delete().eq("id", id);
    if (error) {
      alert("삭제 실패: " + error.message);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-6">
      <header className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold">수정 요청 및 문의사항 목록</h1>
          <p className="mt-1 text-sm text-zinc-500">
            사용자들이 피드백 페이지에서 전송한 목록을 실시간으로 확인합니다.
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-md border border-zinc-350 px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          어드민 홈으로
        </Link>
      </header>

      {errorMsg ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          <p className="font-semibold">피드백 데이터를 불러오지 못했습니다:</p>
          <p className="mt-1 text-xs">{errorMsg}</p>
          <p className="mt-3 text-xs opacity-75">
            * Supabase SQL 에디터에 `feedbacks` 테이블 생성 스크립트를 정상적으로 실행하셨는지 확인해 주세요.
          </p>
        </div>
      ) : loading ? (
        <p className="text-sm text-zinc-500 py-4">불러오는 중...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm text-zinc-650 dark:text-zinc-400">
            <thead className="bg-zinc-50 text-xs uppercase text-zinc-700 dark:bg-zinc-900 dark:text-zinc-350">
              <tr>
                <th className="px-4 py-3">구분</th>
                <th className="px-4 py-3">작성일시</th>
                <th className="px-4 py-3">내용</th>
                <th className="px-4 py-3 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-250 dark:divide-zinc-800">
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-zinc-400">
                    접수된 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                feedbacks.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
                  >
                    <td className="px-4 py-4 font-semibold text-zinc-900 dark:text-zinc-200 whitespace-nowrap">
                      {item.type}
                    </td>
                    <td className="px-4 py-4 text-xs text-zinc-400 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleString("ko-KR")}
                    </td>
                    <td className="px-4 py-4 break-all whitespace-pre-wrap max-w-xl">
                      {item.content}
                    </td>
                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleDeleteFeedback(item.id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
