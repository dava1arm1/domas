"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

/** Вызывает useScrollReveal на серверных страницах услуг. Ничего не рендерит. */
export function RevealInit() {
  useScrollReveal();
  return null;
}
