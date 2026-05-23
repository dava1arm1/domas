"use client";

import { useState, useEffect } from "react";
import type { Subscription } from "@/types";

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subscriptions")
      .then((res) => res.json())
      .then((data) => setSubscription(data.data ?? null))
      .finally(() => setLoading(false));
  }, []);

  const changePlan = async (plan: string) => {
    const res = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    if (res.ok) window.location.reload();
  };

  const cancelSubscription = async () => {
    await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });
    window.location.reload();
  };

  return { subscription, loading, changePlan, cancelSubscription };
}
