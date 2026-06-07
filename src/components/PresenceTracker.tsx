"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function PresenceTracker() {
  useEffect(() => {
    const userId = `user_${Math.random().toString(36).substring(2, 11)}`;
    const channel = supabase.channel("online-users");

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const count = Object.keys(state).length;
        if (typeof window !== "undefined") {
          (window as any).__activeUsers = count;
          window.dispatchEvent(new CustomEvent("presence-update", { detail: count }));
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
            userId,
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return null;
}
