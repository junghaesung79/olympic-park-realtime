"use client";

import { useState } from "react";

export default function Checklist({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  return (
    <ul className="mt-3 grid grid-cols-1 gap-2 text-sm text-zinc-700 sm:grid-cols-2 dark:text-zinc-300">
      {items.map((item) => (
        <li key={item}>
          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800">
            <input
              type="checkbox"
              checked={Boolean(checked[item])}
              onChange={(e) =>
                setChecked((prev) => ({ ...prev, [item]: e.target.checked }))
              }
              className="size-4 shrink-0 accent-zinc-900 dark:accent-zinc-100"
            />
            <span className={checked[item] ? "text-zinc-400 line-through dark:text-zinc-500" : undefined}>
              {item}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}
