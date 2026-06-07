"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard({ host }: { host: string }) {
  const [activeUsers, setActiveUsers] = useState(1);
  const [announcement, setAnnouncement] = useState("");
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    // 1. Fetch initial announcements
    const fetchInitialData = async () => {
      const { data: announcementsData } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });
      if (announcementsData) setAnnouncements(announcementsData);
    };

    fetchInitialData();

    // 2. Subscribe to DB Realtime Changes (announcements)
    const announcementsChannel = supabase
      .channel("admin-announcements-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "announcements" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setAnnouncements((current) => [payload.new, ...current]);
          } else if (payload.eventType === "DELETE") {
            setAnnouncements((current) =>
              current.filter((a) => a.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // 3. Presence channel for tracking active users via window event
    const handlePresenceUpdate = (e: any) => {
      setActiveUsers(e.detail || 1);
    };

    if (typeof window !== "undefined") {
      setActiveUsers((window as any).__activeUsers || 1);
      window.addEventListener("presence-update", handlePresenceUpdate);
    }

    return () => {
      supabase.removeChannel(announcementsChannel);
      if (typeof window !== "undefined") {
        window.removeEventListener("presence-update", handlePresenceUpdate);
      }
    };
  }, []);

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcement) return;

    const { error } = await supabase
      .from("announcements")
      .insert([{ message: announcement }]);

    if (error) {
      alert("공지 전파 오류: " + error.message);
    } else {
      setAnnouncement("");
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) {
      alert("공지 삭제 오류: " + error.message);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-8">
      {/* Header */}
      <section className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          관리자 콘솔
        </h1>
      </section>

      {/* Grid Layout */}
      <div className="grid gap-6 sm:grid-cols-3 max-w-4xl">
        {/* Status Card */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 flex flex-col justify-between min-h-36">
          <div>
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">실시간 접속 인원</h2>
            <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {activeUsers.toLocaleString()}명
            </p>
          </div>
          <span className="block text-xs text-zinc-400">현재 사이트에 열려 있는 세션</span>
        </div>

        {/* Link to Map Pin Manager */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 flex flex-col justify-between min-h-36">
          <div>
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">지도 핀 관리</h2>
            <p className="mt-1 text-xs text-zinc-450 dark:text-zinc-400">
              집결지, 안전 대피소, 화장실 등 핀 정보를 등록 및 관리합니다.
            </p>
          </div>
          <Link
            href="/admin/map"
            className="mt-4 block w-max rounded-md bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            지도 핀 관리하기
          </Link>
        </div>

        {/* Link to Feedback Card */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 flex flex-col justify-between min-h-36">
          <div>
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">수정 요청 및 문의</h2>
            <p className="mt-1 text-xs text-zinc-450 dark:text-zinc-405">
              접수된 피드백 목록을 별도 관리 페이지에서 조회합니다.
            </p>
          </div>
          <Link
            href="/admin/feedback"
            className="mt-4 block w-max rounded-md bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            피드백 목록 보기
          </Link>
        </div>
      </div>

      {/* Real-time Announcements Console */}
      <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 max-w-xl">
        <div>
          <h2 className="text-xl font-bold">공지사항 전파 관리</h2>
          <p className="text-sm text-zinc-500">집결 참여자들에게 즉시 전달될 안내 사항을 등록합니다.</p>
        </div>

        <form onSubmit={handleAddAnnouncement} className="flex gap-2">
          <input
            type="text"
            placeholder="예: 실시간 안전 대피 경로 확보 완료"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="flex-1 rounded-lg border border-zinc-200 bg-zinc-55 px-3 py-2 text-sm focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900"
            required
          />
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            전파
          </button>
        </form>

        <div className="mt-2 flex flex-1 flex-col gap-3">
          <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">전파 중인 메시지</h3>
          <ul className="flex flex-col gap-2">
            {announcements.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-2.5 rounded-lg border border-zinc-100 bg-zinc-50/50 p-3 text-sm dark:border-zinc-800/60 dark:bg-zinc-900/30"
              >
                <span className="flex-1 text-zinc-700 dark:text-zinc-300">{item.message}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteAnnouncement(item.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
