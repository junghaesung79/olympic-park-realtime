"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function MapPinManager() {
  const [pins, setPins] = useState<any[]>([]);
  const [pinForm, setPinForm] = useState({
    id: "",
    type: "집결지",
    label: "",
    x: 50,
    y: 50,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch initial pins
    const fetchPins = async () => {
      try {
        const { data, error } = await supabase
          .from("pins")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) throw error;
        setPins(data || []);
      } catch (err) {
        console.error("Error fetching pins:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPins();

    // 2. Subscribe to DB Realtime Changes
    const channel = supabase
      .channel("admin-map-page-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pins" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setPins((current) => [...current, payload.new]);
          } else if (payload.eventType === "DELETE") {
            setPins((current) => current.filter((p) => p.id !== payload.old.id));
          } else if (payload.eventType === "UPDATE") {
            setPins((current) =>
              current.map((p) => (p.id === payload.new.id ? payload.new : p))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAddPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinForm.label) return;

    const newPin = {
      id: `pin_${Date.now()}`,
      type: pinForm.type,
      label: pinForm.label,
      x: Number(pinForm.x),
      y: Number(pinForm.y),
    };

    const { error } = await supabase.from("pins").insert([newPin]);
    if (error) {
      alert("핀 등록 오류: " + error.message);
    } else {
      setPinForm((prev) => ({
        ...prev,
        label: "",
      }));
    }
  };

  const handleDeletePin = async (id: string) => {
    const { error } = await supabase.from("pins").delete().eq("id", id);
    if (error) {
      alert("핀 삭제 오류: " + error.message);
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPinForm((prev) => ({
      ...prev,
      x: Number(x.toFixed(1)),
      y: Number(y.toFixed(1)),
    }));
  };

  const generatedJson = JSON.stringify(pins, null, 2);

  return (
    <main className="flex flex-1 flex-col gap-6">
      <header className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold">지도 핀 생성 및 관리</h1>
          <p className="mt-1 text-sm text-zinc-500">
            아래 지도 이미지를 클릭하여 실시간 핀 정보를 동적으로 추가하고 관리합니다.
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-md border border-zinc-350 px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          어드민 홈으로
        </Link>
      </header>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Interactive Map Block */}
        <section className="lg:col-span-8 flex flex-col gap-4">
          <div
            onClick={handleMapClick}
            className="relative cursor-crosshair overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800"
          >
            <Image
              src="/map-naver.png"
              alt="올림픽공원 지도"
              width={2940}
              height={1668}
              priority
              className="h-auto w-full select-none pointer-events-none"
            />

            {/* Render Registered Pins */}
            {pins.map((pin) => (
              <div
                key={pin.id}
                className="absolute -translate-x-1/2 -translate-y-full pointer-events-none"
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              >
                <div className="size-3 rounded-full border border-white bg-blue-600 shadow-sm dark:border-zinc-900" />
                <div className="absolute bottom-full left-1/2 mb-1 w-max max-w-48 -translate-x-1/2 rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-medium shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                  <span className="text-zinc-800 dark:text-zinc-200">{pin.label}</span>
                </div>
              </div>
            ))}

            {/* Render Preview/Selected Pin */}
            <div
              className="absolute -translate-x-1/2 -translate-y-full pointer-events-none"
              style={{ left: `${pinForm.x}%`, top: `${pinForm.y}%` }}
            >
              <div className="size-4 rounded-full border border-white bg-red-600 shadow-sm dark:border-zinc-900 animate-bounce" />
              <div className="absolute bottom-full left-1/2 mb-1 w-max -translate-x-1/2 rounded-md bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                선택 위치 ({pinForm.x}%, {pinForm.y}%)
              </div>
            </div>
          </div>
        </section>

        {/* Input Form Panel */}
        <section className="lg:col-span-4 flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-bold">핀 상세 설정</h2>
          <form onSubmit={handleAddPin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-400">구분</label>
              <select
                value={pinForm.type}
                onChange={(e) => setPinForm({ ...pinForm, type: e.target.value })}
                className="rounded-lg border border-zinc-200 bg-zinc-55 px-3 py-2 text-sm focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <option value="집결지">집결지</option>
                <option value="주차/대중교통">주차/대중교통</option>
                <option value="화장실">화장실</option>
                <option value="식수대">식수대</option>
                <option value="휴게 공간">휴게 공간</option>
                <option value="안전 대피소">안전 대피소</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-400">위치 이름</label>
              <input
                type="text"
                placeholder="예: 핸드볼경기장 앞 교차로"
                value={pinForm.label}
                onChange={(e) => setPinForm({ ...pinForm, label: e.target.value })}
                className="rounded-lg border border-zinc-200 bg-zinc-55 px-3 py-2 text-sm focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-400">X 좌표 (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={pinForm.x}
                  onChange={(e) => setPinForm({ ...pinForm, x: Number(e.target.value) })}
                  className="rounded-lg border border-zinc-200 bg-zinc-55 px-3 py-2 text-sm focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-400">Y 좌표 (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={pinForm.y}
                  onChange={(e) => setPinForm({ ...pinForm, y: Number(e.target.value) })}
                  className="rounded-lg border border-zinc-200 bg-zinc-55 px-3 py-2 text-sm focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              핀 추가
            </button>
          </form>
        </section>
      </div>

      {/* Pins List Table Section */}
      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-bold mb-3">등록된 핀 목록 ({pins.length}개)</h2>
        {loading ? (
          <p className="text-sm text-zinc-500">불러오는 중...</p>
        ) : pins.length === 0 ? (
          <p className="text-sm text-zinc-450 text-center py-4">등록된 지도 핀이 없습니다.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            {pins.map((pin) => (
              <li
                key={pin.id}
                className="flex items-center justify-between rounded-lg border border-zinc-150 p-2.5 dark:border-zinc-800"
              >
                <span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    [{pin.type}]
                  </span>{" "}
                  {pin.label} <span className="text-[10px] text-zinc-400">({pin.x}%, {pin.y}%)</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleDeletePin(pin.id)}
                  className="text-xs text-red-500 hover:underline shrink-0 ml-2"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* JSON Output Section */}
      {pins.length > 0 && (
        <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">생성된 핀 JSON 코드</h3>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-100 p-3 text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <code>{generatedJson}</code>
          </pre>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(generatedJson)}
            className="mt-2 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            클립보드 복사하기
          </button>
        </section>
      )}
    </main>
  );
}
