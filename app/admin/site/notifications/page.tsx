"use client";

import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────
interface NotifyTemplate {
  id: string;
  label: string;
  textKey: string;
  enabledKey: string;
  defaultText: string;
}

const TEMPLATES: NotifyTemplate[] = [
  {
    id: "order_confirm",
    label: "Подтверждение заказа",
    textKey: "notify.order_confirm",
    enabledKey: "notify.order_confirm.enabled",
    defaultText:
      "Ваш заказ на услугу «{{service}}» принят! Дата визита: {{date}} в {{time}}. Команда Домас.",
  },
  {
    id: "visit_reminder_24h",
    label: "Напоминание за 24 часа",
    textKey: "notify.visit_reminder_24h",
    enabledKey: "notify.visit_reminder_24h.enabled",
    defaultText:
      "Напоминаем: завтра {{date}} в {{time}} мы приедем выполнить «{{service}}». До встречи!",
  },
  {
    id: "visit_reminder_1h",
    label: "Напоминание за 1 час",
    textKey: "notify.visit_reminder_1h",
    enabledKey: "notify.visit_reminder_1h.enabled",
    defaultText:
      "Наша команда уже едет к вам! Ожидайте в {{time}}. Услуга: {{service}}.",
  },
  {
    id: "order_done",
    label: "Заказ выполнен",
    textKey: "notify.order_done",
    enabledKey: "notify.order_done.enabled",
    defaultText:
      "Услуга «{{service}}» успешно выполнена {{date}}. Спасибо за доверие!",
  },
  {
    id: "payment_success",
    label: "Успешная оплата",
    textKey: "notify.payment_success",
    enabledKey: "notify.payment_success.enabled",
    defaultText:
      "Оплата на сумму {{amount}} прошла успешно. Подписка «{{plan}}» активна.",
  },
  {
    id: "subscription_renew",
    label: "Напоминание продлить подписку",
    textKey: "notify.subscription_renew",
    enabledKey: "notify.subscription_renew.enabled",
    defaultText:
      "Ваша подписка «{{plan}}» заканчивается через 3 дня. Продлите её, чтобы не прерывать сервис.",
  },
];

// Sample variable replacements for preview
const SAMPLE_VARS: Record<string, string> = {
  "{{service}}": "Вывоз мусора",
  "{{date}}":    "25 мая",
  "{{time}}":    "10:00",
  "{{amount}}":  "1490 ₽",
  "{{plan}}":    "Базовый",
};

function applyVars(text: string): string {
  return Object.entries(SAMPLE_VARS).reduce(
    (acc, [k, v]) => acc.replaceAll(k, v),
    text
  );
}

// ─── Toggle ───────────────────────────────────────────────────
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
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#1D9E75] text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">
      <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      Сохранено!
    </div>
  );
}

// ─── Template Card ────────────────────────────────────────────
function TemplateCard({
  template,
  text,
  enabled,
  onTextChange,
  onEnabledChange,
}: {
  template: NotifyTemplate;
  text: string;
  enabled: boolean;
  onTextChange: (v: string) => void;
  onEnabledChange: (v: boolean) => void;
}) {
  const [showPreview, setShowPreview] = useState(false);
  const preview = applyVars(text);

  return (
    <div className={`bg-white rounded-xl shadow-sm border transition-colors ${enabled ? "border-gray-100" : "border-gray-100 opacity-75"}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Toggle value={enabled} onChange={onEnabledChange} />
          <h2 className="font-raleway font-bold text-base text-gray-900 truncate">{template.label}</h2>
          {!enabled && (
            <span className="flex-shrink-0 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              Выключено
            </span>
          )}
          {enabled && (
            <span className="flex-shrink-0 text-xs text-[#1D9E75] bg-[#1D9E75]/10 px-2 py-0.5 rounded-full">
              Активно
            </span>
          )}
        </div>
        <button
          onClick={() => setShowPreview((p) => !p)}
          className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1 transition-colors flex-shrink-0"
        >
          {showPreview ? "Скрыть" : "Предпросмотр"}
        </button>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-4">
        {/* Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Текст шаблона</label>
          <textarea
            rows={4}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] resize-none disabled:bg-gray-50 disabled:text-gray-400"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            disabled={!enabled}
          />
        </div>

        {/* Variables hint */}
        <div className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2">
          <svg className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-gray-500">
            Доступные переменные:{" "}
            {Object.keys(SAMPLE_VARS).map((v, i) => (
              <span key={v}>
                <code className="bg-white border border-gray-200 px-1 rounded text-[11px] text-gray-600">{v}</code>
                {i < Object.keys(SAMPLE_VARS).length - 1 && ", "}
              </span>
            ))}
          </p>
        </div>

        {/* Preview */}
        {showPreview && enabled && (
          <div className="border border-[#1D9E75]/20 bg-[#1D9E75]/5 rounded-lg px-4 py-3">
            <p className="text-xs font-semibold text-[#1D9E75] mb-1.5 uppercase tracking-wide">
              Предпросмотр с примером данных
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{preview}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function NotificationsPage() {
  const [texts, setTexts]     = useState<Record<string, string>>({});
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [savedTexts, setSavedTexts]     = useState<Record<string, string>>({});
  const [savedEnabled, setSavedEnabled] = useState<Record<string, boolean>>({});
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [showToast, setShowToast] = useState(false);

  const isDirty =
    JSON.stringify(texts) !== JSON.stringify(savedTexts) ||
    JSON.stringify(enabled) !== JSON.stringify(savedEnabled);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        const t: Record<string, string> = {};
        const e: Record<string, boolean> = {};
        TEMPLATES.forEach((tpl) => {
          t[tpl.textKey]    = data[tpl.textKey]    ?? tpl.defaultText;
          e[tpl.enabledKey] = data[tpl.enabledKey] !== undefined
            ? data[tpl.enabledKey] === "true"
            : true;
        });
        setTexts(t);
        setEnabled(e);
        setSavedTexts({ ...t });
        setSavedEnabled({ ...e });
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (isDirty) e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const handleSave = async () => {
    setSaving(true);
    const payload: Record<string, string> = {};
    TEMPLATES.forEach((tpl) => {
      payload[tpl.textKey]    = texts[tpl.textKey] ?? tpl.defaultText;
      payload[tpl.enabledKey] = enabled[tpl.enabledKey] ? "true" : "false";
    });
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
      setSavedTexts({ ...texts });
      setSavedEnabled({ ...enabled });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl space-y-4">
        {TEMPLATES.map((t) => (
          <div key={t.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 animate-pulse">
            <div className="h-5 bg-gray-100 rounded w-1/3" />
            <div className="h-24 bg-gray-50 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="p-6 lg:p-8 max-w-4xl space-y-4 pb-28">
        {TEMPLATES.map((tpl) => (
          <TemplateCard
            key={tpl.id}
            template={tpl}
            text={texts[tpl.textKey] ?? tpl.defaultText}
            enabled={enabled[tpl.enabledKey] ?? true}
            onTextChange={(v) => setTexts((prev) => ({ ...prev, [tpl.textKey]: v }))}
            onEnabledChange={(v) => setEnabled((prev) => ({ ...prev, [tpl.enabledKey]: v }))}
          />
        ))}
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
