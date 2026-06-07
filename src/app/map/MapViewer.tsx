"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import MapPins, { type MapPin } from "./MapPins";

export default function MapViewer() {
  const [pins, setPins] = useState<MapPin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    const channel = supabase
      .channel("pins-realtime-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pins" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newPin = payload.new as MapPin;
            setPins((current) => [...current, newPin]);
          } else if (payload.eventType === "DELETE") {
            const deletedPin = payload.old as { id: string };
            setPins((current) => current.filter((p) => p.id !== deletedPin.id));
          } else if (payload.eventType === "UPDATE") {
            const updatedPin = payload.new as MapPin;
            setPins((current) =>
              current.map((p) => (p.id === updatedPin.id ? updatedPin : p))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="text-lg font-semibold">주변 지역 지도</h2>
        <p className="text-xs text-zinc-500 mb-2">실시간 핀 정보가 지도상에 즉시 반영됩니다.</p>
        <div className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <Image
            src="/map-naver.png"
            alt="올림픽공원 일대 지도 (네이버 지도)"
            width={2940}
            height={1668}
            priority
            className="h-auto w-full select-none"
          />
          {!loading && <MapPins pins={pins} />}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">경기장 출입구</h2>
        <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <Image
            src="/arena-gates.jpg"
            alt="핸드볼경기장 좌석 및 출입구 안내도"
            width={1532}
            height={1468}
            className="h-auto w-full"
          />
        </div>
      </section>
    </div>
  );
}
