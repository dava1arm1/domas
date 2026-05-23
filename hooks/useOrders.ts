"use client";

import { useState, useEffect } from "react";
import type { Order } from "@/types";

interface UseOrdersOptions {
  status?: string;
  limit?: number;
}

export function useOrders({ status, limit = 10 }: UseOrdersOptions = {}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (status && status !== "ALL") params.set("status", status);
    params.set("limit", limit.toString());

    fetch(`/api/orders?${params}`)
      .then((res) => res.json())
      .then((data) => setOrders(data.data ?? []))
      .catch(() => setError("Ошибка загрузки заказов"))
      .finally(() => setLoading(false));
  }, [status, limit]);

  return { orders, loading, error };
}
