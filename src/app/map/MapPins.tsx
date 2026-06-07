"use client";

import { useState } from "react";

export type MapPin = {
  id: string;
  type: string;
  label: string;
  /** 이미지 왼쪽 기준 위치 (0~100, %) */
  x: number;
  /** 이미지 위쪽 기준 위치 (0~100, %) */
  y: number;
};

export default function MapPins({ pins }: { pins: MapPin[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="pointer-events-none absolute inset-0">
      {pins.map((pin) => (
        <div
          key={pin.id}
          className="pointer-events-auto absolute -translate-x-1/2 -translate-y-full"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
        >
          <button
            type="button"
            onClick={() =>
              setActiveId((current) => (current === pin.id ? null : pin.id))
            }
            className="block size-4 rounded-full border-2 border-white bg-red-600 shadow dark:border-zinc-900"
            aria-label={`${pin.type}: ${pin.label}`}
          />
          {activeId === pin.id && (
            <div className="absolute bottom-full left-1/2 mb-1 w-max max-w-48 -translate-x-1/2 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs shadow dark:border-zinc-700 dark:bg-zinc-900">
              <span className="block font-medium text-zinc-500 dark:text-zinc-400">
                {pin.type}
              </span>
              <span className="block text-zinc-800 dark:text-zinc-200">
                {pin.label}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
