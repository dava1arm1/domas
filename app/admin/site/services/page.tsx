"use client";

import { useState, useEffect } from "react";
import { SERVICES } from "@/constants/services";

// ─── Types ────────────────────────────────────────────────────
interface ServiceEdit {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  included: string;   // textarea: one item per line
  frequency: string;
  priceNote: string;
  active: boolean;
}

function toEditList(raw: unknown): ServiceEdit[] {
  const defaults: ServiceEdit[] = SERVICES.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    fullDescription: s.fullDescription,
    included: s.included.join("\n"),
    frequency: s.frequency ?? "",
    priceNote: s.priceNote ?? "",
    active: true,
  }));

  if (!raw || !Array.isArray(raw)) return defaults;

  return defaults.map((def) => {
    const saved = raw.find((r: { id: string }) => r.id === def.id);
    if (!saved) return def;
    return {
      id: def.id,
      title: saved.title ?? def.title,
      description: saved.description ?? def.description,
      fullDescription: saved.fullDescription ?? def.fullDescription,
      included: Array.isArray(saved.included) ? saved.included.join("\n") : def.included,
      frequency: saved.frequency ?? def.frequency,
      priceNote: saved.priceNote ?? def.priceNote,
      active: saved.active !== false,
    };
  });
}

function toSavePayload(list: ServiceEdit[]) {
  return list.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    fullDescription: s.fullDescription,
    included: s.included.split("\n").map((l) => l.trim()).filter(Boolean),
    frequency: s.frequency,
    priceNote: s.priceNote,
    active: s.active,
  }));
}

// ─── Toggle ───────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:ring-offset-1 ${
        value ? "bg-[#1D9E75]" : "bg-gray-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          value ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

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

// ─── ServiceCard ──────────────────────────────────────────────
function ServiceCard({
  service,
  index,
  onChange,
}: {
  service: ServiceEdit;
  index: number;
  onChange: (index: number, key: keyof ServiceEdit, value: string | boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const baseService = SERVICES.find((s) => s.id === service.id);

  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${service.active ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50/60"}`}>
      {/* Цветная полоска */}
      {baseService && (
        <div className="h-1" style={{ backgroundColor: baseService.color }} />
      )}

      {/* Шапка карточки */}
      <div className="px-5 py-4 flex items-center gap-4">
        {/* Статус-точка */}
        <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${service.active ? "bg-[#1D9E75]" : "bg-gray-300"}`} />

        {/* Название (кликабельное — раскрывает) */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex-1 text-left flex items-center gap-2 min-w-0"
        >
          <span className={`font-medium text-sm truncate ${service.active ? "text-gray-900" : "text-gray-400"}`}>
            {service.title}
          </span>
          <svg
            className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Активность */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-medium ${service.active ? "text-[#1D9E75]" : "text-gray-400"}`}>
            {service.active ? "Активна" : "Скрыта"}
          </span>
          <Toggle value={service.active} onChange={(v) => onChange(index, "active", v)} />
        </div>
      </div>

      {/* Раскрытые поля */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Название */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Название</label>
              <input
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75]"
                value={service.title}
                onChange={(e) => onChange(index, "title", e.target.value)}
                placeholder="Название услуги"
              />
            </div>

            {/* Периодичность */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Периодичность</label>
              <input
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75]"
                value={service.frequency}
                onChange={(e) => onChange(index, "frequency", e.target.value)}
                placeholder="Еженедельно / По заявке"
              />
            </div>
          </div>

          {/* Краткое описание */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Краткое описание (на карточке)</label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75]"
              value={service.description}
              onChange={(e) => onChange(index, "description", e.target.value)}
              placeholder="1-2 предложения для карточки"
            />
          </div>

          {/* Полное описание */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Полное описание (в модальном окне)</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] resize-none"
              value={service.fullDescription}
              onChange={(e) => onChange(index, "fullDescription", e.target.value)}
              placeholder="Подробное описание услуги для модального окна"
            />
          </div>

          {/* Что включено */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Что включено <span className="font-normal normal-case text-gray-400">(каждый пункт с новой строки)</span>
            </label>
            <textarea
              rows={5}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] resize-none"
              value={service.included}
              onChange={(e) => onChange(index, "included", e.target.value)}
              placeholder={"Пункт 1\nПункт 2\nПункт 3"}
            />
          </div>

          {/* Стоимость */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Стоимость (текст под кнопками)</label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75]"
              value={service.priceNote}
              onChange={(e) => onChange(index, "priceNote", e.target.value)}
              placeholder="По запросу / от 2 500 ₽"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function ServicesPage() {
  const [services, setServices] = useState<ServiceEdit[]>([]);
  const [savedJson, setSavedJson]   = useState("");
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [showToast, setShowToast]   = useState(false);

  const currentJson = JSON.stringify(services);
  const isDirty = currentJson !== savedJson;

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        let raw: unknown = null;
        if (data["site.services"]) {
          try { raw = JSON.parse(data["site.services"]); } catch { /* use defaults */ }
        }
        const list = toEditList(raw);
        setServices(list);
        setSavedJson(JSON.stringify(list));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (isDirty) e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const update = (index: number, key: keyof ServiceEdit, value: string | boolean) => {
    setServices((prev) => prev.map((s, i) => (i === index ? { ...s, [key]: value } : s)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = toSavePayload(services);
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "site.services": JSON.stringify(payload) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? `Ошибка сохранения (${res.status})`);
        return;
      }
      setSavedJson(JSON.stringify(services));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="p-6 lg:p-8 max-w-4xl space-y-6 pb-28">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-raleway font-bold text-base text-gray-900">Услуги</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Нажмите на название услуги чтобы развернуть и отредактировать все поля. Скрытые услуги не отображаются на сайте.
            </p>
          </div>
          <div className="p-4 space-y-2">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                onChange={update}
              />
            ))}
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
