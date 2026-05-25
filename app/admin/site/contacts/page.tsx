"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────
interface ContactFields {
  "site.phone": string;
  "site.email": string;
  "site.hours": string;
  "site.area": string;
  "site.telegram": string;
  "site.legal_name": string;
  "site.ogrnip": string;
  "site.inn": string;
  "site.legal_address": string;
}

const DEFAULTS: ContactFields = {
  "site.phone": "+7 (495) 000-00-00",
  "site.email": "hello@domas.ru",
  "site.hours": "Пн–Вс, 8:00–20:00",
  "site.area": "80 км от МКАД",
  "site.telegram": "https://t.me/domas_bot",
  "site.legal_name": "ИП Иванов Иван Иванович",
  "site.ogrnip": "000000000000000",
  "site.inn": "000000000000",
  "site.legal_address": "г. Москва, ул. Примерная, д. 1",
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

// ─── Field ────────────────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      <input
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function ContactsPage() {
  const [fields, setFields] = useState<ContactFields>(DEFAULTS);
  const [saved, setSaved]   = useState<ContactFields>(DEFAULTS);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [showToast, setShowToast] = useState(false);

  const isDirty = JSON.stringify(fields) !== JSON.stringify(saved);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        const merged = { ...DEFAULTS };
        (Object.keys(DEFAULTS) as (keyof ContactFields)[]).forEach((k) => {
          if (data[k] !== undefined) merged[k] = data[k];
        });
        setFields(merged);
        setSaved(merged);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (isDirty) e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const set = useCallback((key: keyof ContactFields, value: string) => {
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
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-1/3" />
            {[1, 2].map((j) => <div key={j} className="h-10 bg-gray-100 rounded" />)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="p-6 lg:p-8 max-w-4xl space-y-6 pb-28">

        {/* ── Contacts ──────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-raleway font-bold text-base text-gray-900">Контакты</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Телефон" value={fields["site.phone"]} onChange={(v) => set("site.phone", v)} placeholder="+7 (495) 000-00-00" />
              <Field label="Email" value={fields["site.email"]} onChange={(v) => set("site.email", v)} placeholder="hello@domas.ru" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Часы работы" value={fields["site.hours"]} onChange={(v) => set("site.hours", v)} placeholder="Пн–Вс, 8:00–20:00" />
              <Field label="Зона работы" value={fields["site.area"]} onChange={(v) => set("site.area", v)} placeholder="80 км от МКАД" />
            </div>
          </div>
        </div>

        {/* ── Messengers ────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-raleway font-bold text-base text-gray-900">Мессенджеры</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            <Field
              label="Telegram"
              value={fields["site.telegram"]}
              onChange={(v) => set("site.telegram", v)}
              placeholder="https://t.me/domas_bot"
              hint="Ссылка на Telegram-бот или группу"
            />
          </div>
        </div>

        {/* ── Legal ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-raleway font-bold text-base text-gray-900">Юридические реквизиты</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            <Field label="Юридическое наименование" value={fields["site.legal_name"]} onChange={(v) => set("site.legal_name", v)} placeholder="ИП Иванов Иван Иванович" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="ОГРНИП" value={fields["site.ogrnip"]} onChange={(v) => set("site.ogrnip", v)} placeholder="000000000000000" />
              <Field label="ИНН" value={fields["site.inn"]} onChange={(v) => set("site.inn", v)} placeholder="000000000000" />
            </div>
            <Field label="Юридический адрес" value={fields["site.legal_address"]} onChange={(v) => set("site.legal_address", v)} placeholder="г. Москва, ул. Примерная, д. 1" />
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
