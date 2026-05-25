"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────
interface HeroFields {
  "hero.badge": string;
  "hero.heading": string;
  "hero.subtitle": string;
  "hero.cta_primary": string;
  "hero.cta_secondary": string;
  "hero.video_enabled": string;
}

const DEFAULTS: HeroFields = {
  "hero.badge":        "Работаем в радиусе 80 км от МКАД",
  "hero.heading":      "Всё что нужно вашему дому — в одном сервисе.",
  "hero.subtitle":     "Один сервис закрывает все задачи вашего дома — от вывоза отходов до стрижки газона и откачки септика. Для тех, кто ценит своё время.",
  "hero.cta_primary":  "Подключить сервис",
  "hero.cta_secondary":"Узнать подробнее",
  "hero.video_enabled":"true",
};

// ─── Toggle Switch ────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:ring-offset-2 ${
        value ? "bg-[#1D9E75]" : "bg-gray-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          value ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ─── Toast ────────────────────────────────────────────────────
function Toast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#1D9E75] text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
      <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      Сохранено!
    </div>
  );
}

// ─── Hero Preview ─────────────────────────────────────────────
function HeroPreview({ fields }: { fields: HeroFields }) {
  return (
    <div className="sticky top-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Предпросмотр (упрощённый)
      </p>
      <div className="rounded-xl overflow-hidden bg-gray-900 relative min-h-[320px] flex flex-col justify-center p-8">
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800/90 to-gray-900/70 pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-xs">
          {/* Badge */}
          {fields["hero.badge"] && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-[#1D9E75] animate-pulse flex-shrink-0" />
              <span className="text-white text-xs font-medium">{fields["hero.badge"]}</span>
            </div>
          )}

          {/* Heading */}
          <h2 className="text-white font-bold text-xl leading-tight whitespace-pre-wrap">
            {fields["hero.heading"] || <span className="text-white/30 italic">Заголовок...</span>}
          </h2>

          {/* Subtitle */}
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {fields["hero.subtitle"] || <span className="text-white/20 italic">Подзаголовок...</span>}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {fields["hero.cta_primary"] && (
              <div className="bg-[#1D9E75] text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                {fields["hero.cta_primary"]}
              </div>
            )}
            {fields["hero.cta_secondary"] && (
              <div className="border border-white/40 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                {fields["hero.cta_secondary"]}
              </div>
            )}
          </div>

          {/* Video badge */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className={`h-2 w-2 rounded-full flex-shrink-0 ${fields["hero.video_enabled"] === "true" ? "bg-green-400" : "bg-gray-500"}`} />
            <span className="text-white/40 text-xs">
              Видео {fields["hero.video_enabled"] === "true" ? "включено" : "выключено"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function HeroPage() {
  const [fields, setFields] = useState<HeroFields>(DEFAULTS);
  const [saved, setSaved]   = useState<HeroFields>(DEFAULTS);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [showToast, setShowToast] = useState(false);

  const isDirty = JSON.stringify(fields) !== JSON.stringify(saved);

  // Load settings on mount
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        const merged: HeroFields = { ...DEFAULTS };
        (Object.keys(DEFAULTS) as (keyof HeroFields)[]).forEach((k) => {
          if (data[k] !== undefined) merged[k] = data[k];
        });
        setFields(merged);
        setSaved(merged);
      })
      .finally(() => setLoading(false));
  }, []);

  // Warn on unsaved changes (navigation)
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) { e.preventDefault(); }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const set = useCallback((key: keyof HeroFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? `Ошибка сохранения (${res.status}). Убедитесь что выполнен: npx prisma db push`);
        return;
      }
      setSaved(fields);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-1/3" />
            <div className="h-10 bg-gray-100 rounded" />
            <div className="h-20 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="p-6 lg:p-8 max-w-6xl space-y-6 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* ── Left: Form ────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Badge + heading + subtitle */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-raleway font-bold text-base text-gray-900">Текст секции Hero</h2>
              </div>
              <div className="px-6 py-5 space-y-4">

                {/* Badge */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Бейдж</label>
                  {fields["hero.badge"] && (
                    <div className="inline-flex items-center gap-1.5 bg-[#1D9E75]/10 border border-[#1D9E75]/20 rounded-full px-2.5 py-0.5 mb-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#1D9E75]" />
                      <span className="text-[#1D9E75] text-xs font-medium">{fields["hero.badge"]}</span>
                    </div>
                  )}
                  <input
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75]"
                    value={fields["hero.badge"]}
                    onChange={(e) => set("hero.badge", e.target.value)}
                    placeholder="Сервис обслуживания домов"
                  />
                </div>

                {/* Heading */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Главный заголовок</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] resize-none"
                    value={fields["hero.heading"]}
                    onChange={(e) => set("hero.heading", e.target.value)}
                    placeholder="Ваш дом под надёжной защитой"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Подзаголовок</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] resize-none"
                    value={fields["hero.subtitle"]}
                    onChange={(e) => set("hero.subtitle", e.target.value)}
                    placeholder="Краткое описание сервиса..."
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-raleway font-bold text-base text-gray-900">Кнопки призыва к действию</h2>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Кнопка 1 (основная)</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75]"
                    value={fields["hero.cta_primary"]}
                    onChange={(e) => set("hero.cta_primary", e.target.value)}
                    placeholder="Подключить подписку"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Кнопка 2 (дополнительная)</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75]"
                    value={fields["hero.cta_secondary"]}
                    onChange={(e) => set("hero.cta_secondary", e.target.value)}
                    placeholder="Узнать подробнее"
                  />
                </div>
              </div>
            </div>

            {/* Video toggle */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-raleway font-bold text-base text-gray-900">Видео на фоне</h2>
              </div>
              <div className="px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Видео включено</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Файл: <code className="bg-gray-100 px-1 rounded text-[11px]">/public/video/hero.mp4</code>
                    </p>
                  </div>
                  <Toggle
                    value={fields["hero.video_enabled"] === "true"}
                    onChange={(v) => set("hero.video_enabled", v ? "true" : "false")}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* ── Right: Preview ────────────────────────────────── */}
          <HeroPreview fields={fields} />

        </div>
      </div>

      {/* ── Sticky save bar ───────────────────────────────────── */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="text-sm text-amber-600">{isDirty ? "Есть несохранённые изменения" : ""}</span>
        <button
          onClick={handleSave}
          disabled={saving || !isDirty}
          className="bg-[#1D9E75] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1D9E75]/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Сохранение..." : "Сохранить изменения"}
        </button>
      </div>

      <Toast show={showToast} />
    </>
  );
}
