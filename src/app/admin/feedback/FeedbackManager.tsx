"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${month}.${day} ${hours}:${minutes}`;
}

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

  const correctionRequests = feedbacks.filter((f) => f.type === "정보 수정 요청");
  const inquiries = feedbacks.filter((f) => f.type !== "정보 수정 요청");

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
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 mb-3">정보 수정 요청</h2>
            <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-left text-sm text-zinc-650 dark:text-zinc-400">
                <thead className="bg-zinc-100 text-xs uppercase text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                  <tr>
                    <th className="px-4 py-3 font-bold w-16">순번</th>
                    <th className="px-4 py-3 font-bold w-36">작성일시</th>
                    <th className="px-4 py-3 font-bold">내용</th>
                    <th className="px-4 py-3 text-right font-bold w-20">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-250 dark:divide-zinc-800">
                  {correctionRequests.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                        접수된 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    correctionRequests.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
                      >
                        <td className="px-4 py-4 font-semibold text-zinc-950 dark:text-zinc-50 whitespace-nowrap">
                          {correctionRequests.length - index}
                        </td>
                        <td className="px-4 py-4 text-xs text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                          {formatDate(item.created_at)}
                        </td>
                        <td className="px-4 py-4 text-zinc-950 dark:text-zinc-50 break-all whitespace-pre-wrap max-w-xl">
                          {item.content}
                        </td>
                        <td className="px-4 py-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleDeleteFeedback(item.id)}
                            className="text-xs font-medium text-red-650 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:underline"
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
          </div>

          <div>
            <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 mb-3">문의사항</h2>
            <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-left text-sm text-zinc-650 dark:text-zinc-400">
                <thead className="bg-zinc-100 text-xs uppercase text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                  <tr>
                    <th className="px-4 py-3 font-bold w-16">순번</th>
                    <th className="px-4 py-3 font-bold w-36">작성일시</th>
                    <th className="px-4 py-3 font-bold">내용</th>
                    <th className="px-4 py-3 text-right font-bold w-20">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-250 dark:divide-zinc-800">
                  {inquiries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                        접수된 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    inquiries.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
                      >
                        <td className="px-4 py-4 font-semibold text-zinc-950 dark:text-zinc-50 whitespace-nowrap">
                          {inquiries.length - index}
                        </td>
                        <td className="px-4 py-4 text-xs text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                          {formatDate(item.created_at)}
                        </td>
                        <td className="px-4 py-4 text-zinc-950 dark:text-zinc-50 break-all whitespace-pre-wrap max-w-xl">
                          {item.content}
                        </td>
                        <td className="px-4 py-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleDeleteFeedback(item.id)}
                            className="text-xs font-medium text-red-650 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:underline"
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
          </div>
        </div>
      )}
    </main>
  );
}
