"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────
interface FaqItem {
  q: string;
  a: string;
}

interface TextField {
  "seo.home.title": string;
  "seo.home.description": string;
  "texts.footer": string;
  "texts.faq": string; // JSON string
}

const DEFAULT_FAQ: FaqItem[] = [
  { q: "Как работает сервис?", a: "Вы выбираете услугу, мы согласовываем время и приезжаем." },
  { q: "Какой радиус работы?", a: "80 км от МКАД." },
];

const DEFAULTS: TextField = {
  "seo.home.title": "Domas — сервис обслуживания домов",
  "seo.home.description": "Вывоз мусора, клининг, уход за участком и другие услуги по подписке. 80 км от МКАД.",
  "texts.footer": "© 2025 Domas. Все права защищены.",
  "texts.faq": JSON.stringify(DEFAULT_FAQ),
};

// ─── Toast ────────────────────────────────────────────────────
function Toast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#1D9E75] text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">
      <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      Сохранено!
    </div>
  );
}

// ─── Character counter ────────────────────────────────────────
function CharCount({ current, max }: { current: number; max: number }) {
  const over = current > max;
  return (
    <span className={`text-xs ${over ? "text-red-500 font-semibold" : "text-gray-400"}`}>
      {current}/{max}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function TextsPage() {
  const [fields, setFields] = useState<TextField>(DEFAULTS);
  const [saved, setSaved]   = useState<TextField>(DEFAULTS);
  const [faq, setFaq]       = useState<FaqItem[]>(DEFAULT_FAQ);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Sync faq to fields["texts.faq"]
  const faqStr = JSON.stringify(faq);
  const isDirty =
    fields["seo.home.title"] !== saved["seo.home.title"] ||
    fields["seo.home.description"] !== saved["seo.home.description"] ||
    fields["texts.footer"] !== saved["texts.footer"] ||
    faqStr !== saved["texts.faq"];

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        const merged = { ...DEFAULTS };
        (Object.keys(DEFAULTS) as (keyof TextField)[]).forEach((k) => {
          if (data[k] !== undefined) merged[k] = data[k];
        });
        setFields(merged);
        setSaved(merged);
        try {
          const parsed = JSON.parse(merged["texts.faq"]);
          if (Array.isArray(parsed)) setFaq(parsed);
        } catch {
          setFaq(DEFAULT_FAQ);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (isDirty) e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const setField = useCallback((key: keyof TextField, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateFaqItem = (index: number, key: keyof FaqItem, value: string) => {
    setFaq((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const deleteFaqItem = (index: number) => {
    setFaq((prev) => prev.filter((_, i) => i !== index));
  };

  const addFaqItem = () => {
    setFaq((prev) => [...prev, { q: "", a: "" }]);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload: Record<string, string> = {
      "seo.home.title": fields["seo.home.title"],
      "seo.home.description": fields["seo.home.description"],
      "texts.footer": fields["texts.footer"],
      "texts.faq": JSON.stringify(faq),
    };
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? `Ошибка сохранения (${res.status}). Убедитесь что выполнен: npx prisma db push`);
        return;
      }
      const newSaved = { ...fields, "texts.faq": JSON.stringify(faq) };
      setSaved(newSaved);
      setFields(newSaved);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-1/3" />
            <div className="h-10 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="p-6 lg:p-8 max-w-4xl space-y-6 pb-28">

        {/* ── SEO ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-raleway font-bold text-base text-gray-900">SEO — Главная страница</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Title страницы</label>
                <CharCount current={fields["seo.home.title"].length} max={60} />
              </div>
              <input
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75]"
                value={fields["seo.home.title"]}
                onChange={(e) => setField("seo.home.title", e.target.value)}
                placeholder="Domas — сервис обслуживания домов"
              />
              <p className="text-xs text-gray-400 mt-1">Рекомендуемая длина: до 60 символов</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                <CharCount current={fields["seo.home.description"].length} max={160} />
              </div>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] resize-none"
                value={fields["seo.home.description"]}
                onChange={(e) => setField("seo.home.description", e.target.value)}
                placeholder="Краткое описание для поисковых систем..."
              />
              <p className="text-xs text-gray-400 mt-1">Рекомендуемая длина: до 160 символов</p>
            </div>
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-raleway font-bold text-base text-gray-900">Подвал сайта</h2>
          </div>
          <div className="px-6 py-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Текст подвала</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] resize-none"
              value={fields["texts.footer"]}
              onChange={(e) => setField("texts.footer", e.target.value)}
              placeholder="© 2025 Domas. Все права защищены."
            />
          </div>
        </div>

        {/* ── FAQ ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-raleway font-bold text-base text-gray-900">FAQ — Вопросы и ответы</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            {faq.map((item, index) => (
              <div key={index} className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50/50 relative group">
                <button
                  onClick={() => deleteFaqItem(index)}
                  className="absolute top-3 right-3 h-7 w-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Удалить вопрос"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Вопрос {index + 1}
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] bg-white"
                    value={item.q}
                    onChange={(e) => updateFaqItem(index, "q", e.target.value)}
                    placeholder="Как работает сервис?"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Ответ
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] resize-none bg-white"
                    value={item.a}
                    onChange={(e) => updateFaqItem(index, "a", e.target.value)}
                    placeholder="Подробный ответ..."
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addFaqItem}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-400 hover:border-[#1D9E75]/40 hover:text-[#1D9E75] transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Добавить вопрос
            </button>
          </div>
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
