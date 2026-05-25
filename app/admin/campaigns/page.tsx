"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Segment = "ALL" | "ACTIVE" | "CANCELLED";

interface FormState {
  subject: string;
  body: string;
  segment: Segment;
}

// ─── Mock history ─────────────────────────────────────────────────────────────

const MOCK_HISTORY = [
  {
    id: "1",
    date: "14 мая 2026",
    subject: "Летнее предложение: скидка 20% на тариф Комфорт",
    recipients: 142,
    openRate: 38,
    segment: "Все клиенты",
  },
  {
    id: "2",
    date: "1 мая 2026",
    subject: "Майские праздники — мы работаем без выходных",
    recipients: 89,
    openRate: 45,
    segment: "Активные подписчики",
  },
  {
    id: "3",
    date: "15 апреля 2026",
    subject: "Мы скучали! Специальное предложение для возврата",
    recipients: 53,
    openRate: 29,
    segment: "Неактивные 30+ дней",
  },
];

const SEGMENT_LABELS: Record<Segment, string> = {
  ALL: "Все клиенты",
  ACTIVE: "Активные подписчики",
  CANCELLED: "Неактивные 30+ дней",
};

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const INITIAL_FORM: FormState = { subject: "", body: "", segment: "ALL" };

export default function CampaignsPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSend = async () => {
    if (!form.subject.trim() || !form.body.trim()) return;
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка сервера");
      setSuccessMsg(`Отправлено ${data.recipients ?? 0} получателям`);
      setForm(INITIAL_FORM);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  const canSend = form.subject.trim().length > 0 && form.body.trim().length > 0 && !loading;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Left column: form (2/3) ── */}
        <div className="flex-1 lg:flex-[2] space-y-6">

          {/* Success banner */}
          {successMsg && (
            <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm">
              <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {/* Error banner */}
          {errorMsg && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
              <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Campaign form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="font-semibold text-[#111827] text-base">Новая рассылка</h2>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">
                Заголовок письма
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                placeholder="Например: Обновления и новости Domas"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent transition"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">
                Текст письма
              </label>
              <textarea
                value={form.body}
                onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
                placeholder="Введите текст письма. Поддерживаются переносы строк."
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent transition resize-y min-h-48"
              />
            </div>

            {/* Segment */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                Сегмент получателей
              </label>
              <div className="space-y-2">
                {(["ALL", "ACTIVE", "CANCELLED"] as Segment[]).map((seg) => (
                  <label
                    key={seg}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      form.segment === seg
                        ? "border-[#1D9E75] bg-[#1D9E75]/5"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="segment"
                      value={seg}
                      checked={form.segment === seg}
                      onChange={() => setForm((p) => ({ ...p, segment: seg }))}
                      className="accent-[#1D9E75]"
                    />
                    <span className={`text-sm font-medium ${form.segment === seg ? "text-[#1D9E75]" : "text-[#111827]"}`}>
                      {SEGMENT_LABELS[seg]}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!canSend}
              className="inline-flex items-center gap-2 bg-[#1D9E75] text-white px-4 py-2 rounded-lg hover:bg-[#1D9E75]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
            >
              {loading && <Spinner />}
              {loading ? "Отправляем..." : "Отправить рассылку"}
            </button>
          </div>

          {/* Email preview */}
          {(form.subject || form.body) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="h-4 w-4 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <h2 className="text-sm font-semibold text-[#6b7280] uppercase tracking-wide">
                  Предпросмотр письма
                </h2>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Email header */}
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 space-y-1">
                  <div className="flex items-baseline gap-2 text-xs">
                    <span className="text-[#6b7280] w-10 flex-shrink-0">От:</span>
                    <span className="text-[#111827]">Domas &lt;noreply@domas.ru&gt;</span>
                  </div>
                  <div className="flex items-baseline gap-2 text-xs">
                    <span className="text-[#6b7280] w-10 flex-shrink-0">Кому:</span>
                    <span className="text-[#111827]">{SEGMENT_LABELS[form.segment]}</span>
                  </div>
                  {form.subject && (
                    <div className="flex items-baseline gap-2 text-xs">
                      <span className="text-[#6b7280] w-10 flex-shrink-0">Тема:</span>
                      <span className="font-semibold text-[#111827]">{form.subject}</span>
                    </div>
                  )}
                </div>
                {/* Email body */}
                <div className="bg-white px-5 py-4 min-h-24">
                  {form.body ? (
                    <p className="text-sm text-[#111827] whitespace-pre-line leading-relaxed">
                      {form.body}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-300 italic">Текст письма будет отображён здесь...</p>
                  )}
                </div>
                {/* Email footer */}
                <div className="bg-gray-50 border-t border-gray-200 px-5 py-3">
                  <p className="text-xs text-gray-400">
                    © 2026 Domas · Вы получили это письмо, так как являетесь клиентом сервиса.
                    <span className="ml-1 underline cursor-pointer">Отписаться</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right column: history (1/3) ── */}
        <div className="lg:flex-[1] space-y-4 min-w-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-[#111827] mb-1">История рассылок</h2>
            <p className="text-xs text-[#6b7280] mb-4">
              История будет сохраняться после первой отправки
            </p>

            <div className="space-y-3">
              {MOCK_HISTORY.map((item) => (
                <div key={item.id} className="border border-gray-100 rounded-lg p-4 space-y-2 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-[#111827] leading-snug flex-1 min-w-0">
                      {item.subject}
                    </p>
                    <span className="text-xs text-[#6b7280] whitespace-nowrap flex-shrink-0">
                      {item.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#6b7280]">
                    <div className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{item.recipients} получателей</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Открытий: {item.openRate}%</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {item.segment}
                  </span>
                </div>
              ))}
            </div>

            {/* Placeholder note */}
            <div className="mt-4 bg-[#1D9E75]/5 border border-[#1D9E75]/20 rounded-lg px-3 py-2.5">
              <p className="text-xs text-[#1D9E75]">
                Данные выше — пример отображения. Реальная история появится здесь после первой отправки рассылки.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
