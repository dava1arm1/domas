"use client";

import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────
interface Service {
  id: string;
  title: string;
  description: string;
  active: boolean;
}

const DEFAULT_SERVICES: Service[] = [
  { id: "waste_removal",       title: "Вывоз мусора",              description: "Регулярный вывоз ТКО по расписанию.",     active: true },
  { id: "construction_waste",  title: "Вывоз строительных отходов", description: "Вывоз строительного мусора по заявке.",   active: true },
  { id: "lawn_care",           title: "Уход за участком",           description: "Стрижка газона, обрезка кустарников.",    active: true },
  { id: "septic_pumping",      title: "Откачка септика",            description: "Плановая и аварийная откачка.",           active: true },
  { id: "snow_removal",        title: "Уборка снега",               description: "Расчистка дорожек и подъезда.",           active: true },
  { id: "cleaning",            title: "Клининг",                    description: "Уборка дома по расписанию.",              active: true },
];

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

// ─── Drag handle icon ─────────────────────────────────────────
function DragHandle() {
  return (
    <svg className="h-5 w-5 text-gray-300 flex-shrink-0 cursor-grab" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [savedJson, setSavedJson] = useState(JSON.stringify(DEFAULT_SERVICES));
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [showToast, setShowToast] = useState(false);

  const currentJson = JSON.stringify(services);
  const isDirty = currentJson !== savedJson;

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        if (data["site.services"]) {
          try {
            const parsed = JSON.parse(data["site.services"]);
            if (Array.isArray(parsed)) {
              setServices(parsed);
              setSavedJson(data["site.services"]);
            }
          } catch {
            // keep defaults
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (isDirty) e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const update = (index: number, key: keyof Service, value: string | boolean) => {
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [key]: value } : s))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "site.services": JSON.stringify(services) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? `Ошибка сохранения (${res.status}). Убедитесь что выполнен: npx prisma db push`);
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
      <div className="p-6 lg:p-8 max-w-4xl space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 animate-pulse">
          <div className="h-4 bg-gray-100 rounded w-1/4" />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-16 bg-gray-50 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 lg:p-8 max-w-4xl space-y-6 pb-28">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-raleway font-bold text-base text-gray-900">Услуги</h2>
            <p className="text-xs text-gray-400 mt-0.5">Редактируйте названия, описания и активность услуг</p>
          </div>
          <div className="divide-y divide-gray-50">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`px-6 py-4 flex items-center gap-4 transition-colors ${
                  service.active ? "bg-white" : "bg-gray-50/60"
                }`}
              >
                {/* Drag handle (decorative) */}
                <DragHandle />

                {/* Status dot */}
                <div
                  className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                    service.active ? "bg-[#1D9E75]" : "bg-gray-300"
                  }`}
                />

                {/* Editable fields */}
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] bg-white"
                    value={service.title}
                    onChange={(e) => update(index, "title", e.target.value)}
                    placeholder="Название услуги"
                  />
                  <input
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] bg-white"
                    value={service.description}
                    onChange={(e) => update(index, "description", e.target.value)}
                    placeholder="Краткое описание"
                  />
                </div>

                {/* Toggle */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-medium ${service.active ? "text-[#1D9E75]" : "text-gray-400"}`}>
                    {service.active ? "Активна" : "Скрыта"}
                  </span>
                  <Toggle
                    value={service.active}
                    onChange={(v) => update(index, "active", v)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-xl px-5 py-4 flex items-start gap-3">
          <svg className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-amber-700">
            Набор услуг фиксированный. Вы можете скрыть ненужные услуги, изменить их названия и описания.
          </p>
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
