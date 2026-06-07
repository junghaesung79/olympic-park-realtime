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
  const [correctionRequests, setCorrectionRequests] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [correctionLoading, setCorrectionLoading] = useState(true);
  const [inquiryLoading, setInquiryLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedCorrectionStatuses, setSelectedCorrectionStatuses] = useState<string[]>(["보류"]);
  const [selectedInquiryStatuses, setSelectedInquiryStatuses] = useState<string[]>(["보류"]);

  const fetchCorrectionRequests = async (showLoading = true) => {
    if (showLoading) setCorrectionLoading(true);
    try {
      const { data, error } = await supabase
        .from("feedbacks")
        .select("*")
        .eq("type", "정보 수정 요청")
        .order("created_at", { ascending: true }); // 시간 오래된 게 위로

      if (error) throw error;
      setCorrectionRequests(data || []);
    } catch (err: any) {
      console.error("Detailed error fetching correction requests:", err);
      setErrorMsg(
        err.message ||
        (err.details ? `${err.message} (${err.details})` : JSON.stringify(err)) ||
        "알 수 없는 에러가 발생했습니다."
      );
    } finally {
      if (showLoading) setCorrectionLoading(false);
    }
  };

  const fetchInquiries = async (showLoading = true) => {
    if (showLoading) setInquiryLoading(true);
    try {
      const { data, error } = await supabase
        .from("feedbacks")
        .select("*")
        .neq("type", "정보 수정 요청")
        .order("created_at", { ascending: true }); // 시간 오래된 게 위로

      if (error) throw error;
      setInquiries(data || []);
    } catch (err: any) {
      console.error("Detailed error fetching inquiries:", err);
      setErrorMsg(
        err.message ||
        (err.details ? `${err.message} (${err.details})` : JSON.stringify(err)) ||
        "알 수 없는 에러가 발생했습니다."
      );
    } finally {
      if (showLoading) setInquiryLoading(false);
    }
  };

  useEffect(() => {
    fetchCorrectionRequests(true);
    fetchInquiries(true);

    // Subscribe to DB Realtime Changes
    const channel = supabase
      .channel("admin-feedback-page-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feedbacks" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const item = payload.new;
            if (item.type === "정보 수정 요청") {
              setCorrectionRequests((current) => [...current, item]);
            } else {
              setInquiries((current) => [...current, item]);
            }
          } else if (payload.eventType === "UPDATE") {
            const item = payload.new;
            // Update in correctionRequests if it belongs, otherwise update in inquiries
            if (item.type === "정보 수정 요청") {
              setCorrectionRequests((current) =>
                current.map((f) => (f.id === item.id ? item : f))
              );
            } else {
              setInquiries((current) =>
                current.map((f) => (f.id === item.id ? item : f))
              );
            }
          } else if (payload.eventType === "DELETE") {
            const oldId = payload.old.id;
            setCorrectionRequests((current) => current.filter((f) => f.id !== oldId));
            setInquiries((current) => current.filter((f) => f.id !== oldId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("feedbacks")
      .update({ status: newStatus })
      .eq("id", id);
    if (error) {
      alert("상태 변경 실패: " + error.message);
    }
  };

  const displayCorrectionRequests = correctionRequests.filter((f) =>
    selectedCorrectionStatuses.includes(f.status || "보류")
  );

  const displayInquiries = inquiries.filter((f) =>
    selectedInquiryStatuses.includes(f.status || "보류")
  );

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
      ) : (
        <div className="flex flex-col gap-8">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">정보 수정 요청</h2>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">상태 필터:</span>
                  {["보류", "반영", "숨김"].map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-1.5 text-xs cursor-pointer select-none text-zinc-700 dark:text-zinc-300"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCorrectionStatuses.includes(status)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCorrectionStatuses([...selectedCorrectionStatuses, status]);
                          } else {
                            setSelectedCorrectionStatuses(
                              selectedCorrectionStatuses.filter((s) => s !== status)
                            );
                          }
                        }}
                        className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-700 h-3.5 w-3.5"
                      />
                      <span>{status}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => fetchCorrectionRequests(true)}
                  disabled={correctionLoading}
                  className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-850 dark:text-zinc-300 dark:hover:bg-zinc-800 disabled:opacity-50"
                >
                  {correctionLoading ? "불러오는 중..." : "새로고침"}
                </button>
              </div>
            </div>
            <div className={`overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800 transition-opacity duration-200 ${correctionLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
              <table className="w-full text-left text-sm text-zinc-650 dark:text-zinc-400">
                <thead className="bg-zinc-100 text-xs uppercase text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                  <tr>
                    <th className="px-4 py-3 font-bold w-16 text-center">순번</th>
                    <th className="px-4 py-3 font-bold w-36">작성일시</th>
                    <th className="px-4 py-3 font-bold">내용</th>
                    <th className="px-4 py-3 text-right font-bold w-48">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-250 dark:divide-zinc-800">
                  {displayCorrectionRequests.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-zinc-500 text-sm">
                        접수된 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    displayCorrectionRequests.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
                      >
                        <td className="px-4 py-4 text-sm font-normal text-zinc-900 dark:text-zinc-100 whitespace-nowrap text-center">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4 text-sm font-normal text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                          {formatDate(item.created_at)}
                        </td>
                        <td className="px-4 py-4 text-sm font-normal text-zinc-900 dark:text-zinc-100 break-all whitespace-pre-wrap max-w-xl">
                          {item.content}
                        </td>
                        <td className="px-4 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(item.id, "반영")}
                              className={`rounded px-2 py-1 text-xs font-medium border transition-colors ${
                                item.status === "반영"
                                  ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900"
                                  : "bg-white text-zinc-650 border-zinc-250 hover:bg-zinc-50 dark:bg-zinc-850 dark:text-zinc-400 dark:border-zinc-750 dark:hover:bg-zinc-800"
                              }`}
                            >
                              ✓ 반영
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(item.id, "숨김")}
                              className={`rounded px-2 py-1 text-xs font-medium border transition-colors ${
                                item.status === "숨김"
                                  ? "bg-red-100 text-red-850 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900"
                                  : "bg-white text-zinc-655 border-zinc-250 hover:bg-zinc-50 dark:bg-zinc-850 dark:text-zinc-400 dark:border-zinc-750 dark:hover:bg-zinc-800"
                              }`}
                            >
                              ✗ 숨김
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(item.id, "보류")}
                              className={`rounded px-2 py-1 text-xs font-medium border transition-colors ${
                                item.status === "보류" || !item.status
                                  ? "bg-zinc-200 text-zinc-800 border-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-600"
                                  : "bg-white text-zinc-650 border-zinc-250 hover:bg-zinc-50 dark:bg-zinc-850 dark:text-zinc-400 dark:border-zinc-750 dark:hover:bg-zinc-800"
                              }`}
                            >
                              = 보류
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">문의사항</h2>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">상태 필터:</span>
                  {["보류", "반영", "숨김"].map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-1.5 text-xs cursor-pointer select-none text-zinc-700 dark:text-zinc-300"
                    >
                      <input
                        type="checkbox"
                        checked={selectedInquiryStatuses.includes(status)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedInquiryStatuses([...selectedInquiryStatuses, status]);
                          } else {
                            setSelectedInquiryStatuses(
                              selectedInquiryStatuses.filter((s) => s !== status)
                            );
                          }
                        }}
                        className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-700 h-3.5 w-3.5"
                      />
                      <span>{status}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => fetchInquiries(true)}
                  disabled={inquiryLoading}
                  className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-850 dark:text-zinc-300 dark:hover:bg-zinc-800 disabled:opacity-50"
                >
                  {inquiryLoading ? "불러오는 중..." : "새로고침"}
                </button>
              </div>
            </div>
            <div className={`overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800 transition-opacity duration-200 ${inquiryLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
              <table className="w-full text-left text-sm text-zinc-650 dark:text-zinc-400">
                <thead className="bg-zinc-100 text-xs uppercase text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                  <tr>
                    <th className="px-4 py-3 font-bold w-16 text-center">순번</th>
                    <th className="px-4 py-3 font-bold w-36">작성일시</th>
                    <th className="px-4 py-3 font-bold">내용</th>
                    <th className="px-4 py-3 text-right font-bold w-48">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-250 dark:divide-zinc-800">
                  {displayInquiries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-zinc-500 text-sm">
                        접수된 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    displayInquiries.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
                      >
                        <td className="px-4 py-4 text-sm font-normal text-zinc-900 dark:text-zinc-100 whitespace-nowrap text-center">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4 text-sm font-normal text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                          {formatDate(item.created_at)}
                        </td>
                        <td className="px-4 py-4 text-sm font-normal text-zinc-900 dark:text-zinc-100 break-all whitespace-pre-wrap max-w-xl">
                          {item.content}
                        </td>
                        <td className="px-4 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(item.id, "반영")}
                              className={`rounded px-2 py-1 text-xs font-medium border transition-colors ${
                                item.status === "반영"
                                  ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900"
                                  : "bg-white text-zinc-655 border-zinc-250 hover:bg-zinc-50 dark:bg-zinc-850 dark:text-zinc-400 dark:border-zinc-750 dark:hover:bg-zinc-800"
                              }`}
                            >
                              ✓ 반영
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(item.id, "숨김")}
                              className={`rounded px-2 py-1 text-xs font-medium border transition-colors ${
                                item.status === "숨김"
                                  ? "bg-red-100 text-red-855 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900"
                                  : "bg-white text-zinc-655 border-zinc-250 hover:bg-zinc-50 dark:bg-zinc-850 dark:text-zinc-400 dark:border-zinc-750 dark:hover:bg-zinc-800"
                              }`}
                            >
                              ✗ 숨김
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(item.id, "보류")}
                              className={`rounded px-2 py-1 text-xs font-medium border transition-colors ${
                                item.status === "보류" || !item.status
                                  ? "bg-zinc-200 text-zinc-800 border-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-600"
                                  : "bg-white text-zinc-650 border-zinc-250 hover:bg-zinc-50 dark:bg-zinc-850 dark:text-zinc-400 dark:border-zinc-750 dark:hover:bg-zinc-800"
                              }`}
                            >
                              = 보류
                            </button>
                          </div>
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
