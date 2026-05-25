"use client";

import { useState, useEffect } from "react";
import { SERVICES } from "@/constants/services";
import type { Address, Subscription } from "@prisma/client";

// ─── Types ────────────────────────────────────────────────────────
type Step = 1 | 2 | 3 | 4 | "success";

interface NewAddressForm {
  fullAddress: string;
  city: string;
  landmark: string;
  label: string;
  save: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  user: { id: string; name: string; phone?: string | null };
  addresses: Address[];
  subscription: Subscription | null;
  onSuccess?: () => void;
}

// ─── Constants ────────────────────────────────────────────────────
const STEP_LABELS = ["Услуга", "Адрес", "Дата и время", "Подтверждение"];

const TIME_SLOTS_BY_PERIOD = [
  { period: "Утро",  slots: ["09:00–11:00", "10:00–12:00", "11:00–13:00"] },
  { period: "День",  slots: ["13:00–15:00", "14:00–16:00", "15:00–17:00"] },
  { period: "Вечер", slots: ["16:00–18:00", "17:00–19:00"] },
];

const RECURRING_OPTIONS = [
  { value: "once",         label: "Разово" },
  { value: "weekly",       label: "Еженедельно" },
  { value: "twice_weekly", label: "2 раза в неделю" },
  { value: "monthly",      label: "Ежемесячно" },
];

const ADDRESS_LABELS = ["Дом", "Дача", "Другое"];

// ─── Helpers ──────────────────────────────────────────────────────
function formatDateLong(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function cap(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

// ─── Calendar ─────────────────────────────────────────────────────
function MiniCalendar({ selected, onSelect }: { selected: string; onSelect: (d: string) => void }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [view, setView] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const yr = view.getFullYear();
  const mo = view.getMonth();
  const daysInMonth = new Date(yr, mo + 1, 0).getDate();
  const firstDayRaw = new Date(yr, mo, 1).getDay();
  const firstDay = firstDayRaw === 0 ? 6 : firstDayRaw - 1; // Mon-first

  const cells: (number | null)[] = [
    ...Array<null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthLabel = cap(view.toLocaleDateString("ru-RU", { month: "long", year: "numeric" }));

  const pad = (n: number) => String(n).padStart(2, "0");
  const toStr = (day: number) => `${yr}-${pad(mo + 1)}-${pad(day)}`;

  return (
    <div className="bg-gray-50 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setView(v => new Date(v.getFullYear(), v.getMonth() - 1, 1))}
          className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-gray-800">{monthLabel}</span>
        <button
          onClick={() => setView(v => new Date(v.getFullYear(), v.getMonth() + 1, 1))}
          className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(d => (
          <div key={d} className="text-center text-[11px] font-medium text-gray-400 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`n${i}`} />;
          const past = new Date(yr, mo, day) < today;
          const isTodayCell = today.getDate() === day && today.getMonth() === mo && today.getFullYear() === yr;
          const sel = selected === toStr(day);
          return (
            <button
              key={day}
              disabled={past}
              onClick={() => !past && onSelect(toStr(day))}
              className={[
                "h-9 w-full rounded-lg text-sm font-medium transition-all duration-150",
                past ? "text-gray-300 cursor-not-allowed" : "cursor-pointer",
                sel ? "bg-[#1D9E75] text-white shadow-sm" : "",
                isTodayCell && !sel ? "ring-2 ring-[#1D9E75] text-[#1D9E75] font-bold" : "",
                !past && !sel && !isTodayCell ? "text-gray-700 hover:bg-white hover:shadow-sm" : "",
              ].filter(Boolean).join(" ")}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Confetti ─────────────────────────────────────────────────────
function Confetti() {
  const COLORS = ["#1D9E75", "#5DCAA5", "#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#F7B731"];
  const pieces = Array.from({ length: 48 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 7 + Math.random() * 7,
    color: COLORS[i % COLORS.length],
    delay: Math.random() * 0.9,
    dur: 1.6 + Math.random() * 1.4,
    circle: Math.random() > 0.5,
    r0: Math.floor(Math.random() * 360),
  }));
  return (
    <>
      <style>{`@keyframes cf{0%{transform:translateY(-80px) rotateZ(0deg);opacity:1}100%{transform:translateY(110vh) rotateZ(720deg);opacity:0}}`}</style>
      <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden" aria-hidden>
        {pieces.map(p => (
          <div key={p.id} style={{
            position: "absolute", left: `${p.left}%`, top: 0,
            width: p.size, height: p.size, backgroundColor: p.color,
            borderRadius: p.circle ? "50%" : "3px",
            animation: `cf ${p.dur}s ${p.delay}s ease-in forwards`,
            transform: `rotateZ(${p.r0}deg)`,
          }} />
        ))}
      </div>
    </>
  );
}

// ─── Step 1 – Выбор услуги ────────────────────────────────────────
function Step1({
  selected, onSelect, hasSubscription,
}: {
  selected: string;
  onSelect: (id: string) => void;
  hasSubscription: boolean;
}) {
  const services = hasSubscription
    ? SERVICES.filter(s => !s.isPrimarySubscription)
    : SERVICES;

  return (
    <div className="space-y-2.5">
      {services.map(s => {
        const active = selected === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={[
              "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-150 text-left",
              active
                ? "border-[#1D9E75] bg-[#f0faf6] shadow-sm"
                : "border-gray-100 bg-gray-50/60 hover:border-gray-200 hover:bg-white",
            ].join(" ")}
          >
            <span className="text-2xl flex-shrink-0">{s.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm leading-tight">{s.title}</p>
              <p className="text-gray-500 text-xs mt-0.5 line-clamp-2 leading-relaxed">{s.description}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {s.isPrimarySubscription && (
                  <span className="text-[10px] font-semibold text-[#1D9E75] bg-[#e8f7f2] px-2 py-0.5 rounded-full">
                    Подписка
                  </span>
                )}
                {s.frequency && <span className="text-[10px] text-gray-400">{s.frequency}</span>}
                <span className="text-[10px] font-medium text-gray-500 ml-auto">{s.priceNote}</span>
              </div>
            </div>
            <div className={[
              "flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
              active ? "bg-[#1D9E75] border-[#1D9E75]" : "border-gray-300",
            ].join(" ")}>
              {active && (
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Step 2 – Адрес ───────────────────────────────────────────────
function Step2({
  addresses, selected, onSelect,
  useNew, onToggleNew,
  newForm, onNewFormChange,
  errors,
}: {
  addresses: Address[];
  selected: string | null;
  onSelect: (id: string) => void;
  useNew: boolean;
  onToggleNew: (v: boolean) => void;
  newForm: NewAddressForm;
  onNewFormChange: (f: NewAddressForm) => void;
  errors: Record<string, string>;
}) {
  const PinIcon = () => (
    <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  return (
    <div className="space-y-2.5">
      {addresses.map(addr => {
        const active = !useNew && selected === addr.id;
        return (
          <button
            key={addr.id}
            onClick={() => { onSelect(addr.id); onToggleNew(false); }}
            className={[
              "w-full flex items-start gap-3 p-4 rounded-2xl border-2 transition-all duration-150 text-left",
              active
                ? "border-[#1D9E75] bg-[#f0faf6] shadow-sm"
                : "border-gray-100 bg-gray-50/60 hover:border-gray-200 hover:bg-white",
            ].join(" ")}
          >
            <div className="h-8 w-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <PinIcon />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900">{addr.label}</p>
              <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{addr.address}</p>
            </div>
            <div className={[
              "flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all",
              active ? "bg-[#1D9E75] border-[#1D9E75]" : "border-gray-300",
            ].join(" ")}>
              {active && (
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        );
      })}

      {/* New address button */}
      <button
        onClick={() => onToggleNew(!useNew)}
        className={[
          "w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-150 text-left",
          useNew
            ? "border-[#1D9E75] bg-[#f0faf6]"
            : "border-dashed border-gray-200 bg-white hover:border-gray-300",
        ].join(" ")}
      >
        <div className="h-8 w-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span className="font-semibold text-sm text-gray-700">Новый адрес</span>
      </button>

      {/* Inline new address form */}
      {useNew && (
        <div className="space-y-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <Field label="Полный адрес" required error={errors.fullAddress}>
            <input
              type="text"
              value={newForm.fullAddress}
              onChange={e => onNewFormChange({ ...newForm, fullAddress: e.target.value })}
              placeholder="Московская область, д. Барвиха, ул. Лесная, 12"
              className={inputCls(!!errors.fullAddress)}
            />
          </Field>

          <Field label="Населённый пункт" required error={errors.city}>
            <input
              type="text"
              value={newForm.city}
              onChange={e => onNewFormChange({ ...newForm, city: e.target.value })}
              placeholder="Барвиха"
              className={inputCls(!!errors.city)}
            />
          </Field>

          <Field label="Ориентир / комментарий к адресу">
            <textarea
              value={newForm.landmark}
              onChange={e => onNewFormChange({ ...newForm, landmark: e.target.value })}
              placeholder="Код ворот, цвет забора, собака во дворе..."
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1D9E75] resize-none transition-all"
            />
          </Field>

          {/* Save toggle */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm text-gray-700">Сохранить адрес</span>
            <button
              type="button"
              onClick={() => onNewFormChange({ ...newForm, save: !newForm.save })}
              className={[
                "relative h-6 w-11 rounded-full transition-colors duration-200",
                newForm.save ? "bg-[#1D9E75]" : "bg-gray-300",
              ].join(" ")}
              role="switch"
              aria-checked={newForm.save}
            >
              <span className={[
                "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
                newForm.save ? "translate-x-5" : "translate-x-0",
              ].join(" ")} />
            </button>
          </div>

          {/* Label picker */}
          {newForm.save && (
            <div className="flex gap-2">
              {ADDRESS_LABELS.map(l => (
                <button
                  key={l}
                  onClick={() => onNewFormChange({ ...newForm, label: l })}
                  className={[
                    "flex-1 py-2 rounded-xl text-sm font-medium border transition-all",
                    newForm.label === l
                      ? "bg-[#1D9E75] text-white border-[#1D9E75]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300",
                  ].join(" ")}
                >
                  {l}
                </button>
              ))}
            </div>
          )}

          {/* Zone note */}
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mt-1">
            <svg className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-amber-700 leading-relaxed">
              Мы работаем в радиусе 80 км от МКАД. Если адрес за зоной — менеджер свяжется для уточнения.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 3 – Дата и время ────────────────────────────────────────
function Step3({
  date, onDateSelect,
  timeSlot, onTimeSlotSelect,
  recurring, onRecurringChange,
  specialRequests, onSpecialChange,
  isSubscription,
  errors,
}: {
  date: string; onDateSelect: (d: string) => void;
  timeSlot: string; onTimeSlotSelect: (t: string) => void;
  recurring: string; onRecurringChange: (r: string) => void;
  specialRequests: string; onSpecialChange: (s: string) => void;
  isSubscription: boolean;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Выберите дату</p>
        <MiniCalendar selected={date} onSelect={onDateSelect} />
        {errors.date && <p className="text-xs text-red-500 mt-1.5">{errors.date}</p>}
      </div>

      {date && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Время · <span className="text-[#1D9E75]">{cap(formatDateLong(date))}</span>
          </p>
          <div className="space-y-3">
            {TIME_SLOTS_BY_PERIOD.map(({ period, slots }) => (
              <div key={period}>
                <p className="text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">{period}</p>
                <div className="flex flex-wrap gap-2">
                  {slots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => onTimeSlotSelect(slot)}
                      className={[
                        "px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150",
                        timeSlot === slot
                          ? "bg-[#1D9E75] text-white border-[#1D9E75] shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#1D9E75] hover:text-[#1D9E75]",
                      ].join(" ")}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {errors.timeSlot && <p className="text-xs text-red-500 mt-1.5">{errors.timeSlot}</p>}
        </div>
      )}

      {isSubscription && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Периодичность</p>
          <div className="grid grid-cols-2 gap-2">
            {RECURRING_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => onRecurringChange(opt.value)}
                className={[
                  "py-2.5 px-3 rounded-xl text-sm font-medium border transition-all duration-150 text-left",
                  recurring === opt.value
                    ? "bg-[#1D9E75] text-white border-[#1D9E75]"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300",
                ].join(" ")}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">
          Особые пожелания <span className="font-normal text-gray-400">(необязательно)</span>
        </label>
        <textarea
          value={specialRequests}
          onChange={e => onSpecialChange(e.target.value)}
          rows={3}
          placeholder="Например: собака во дворе, нужен звонок за 30 минут до приезда"
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D9E75] resize-none transition-all"
        />
      </div>
    </div>
  );
}

// ─── Step 4 – Подтверждение ───────────────────────────────────────
function Step4({
  service, address, useNewAddress, newAddress,
  date, timeSlot, recurring,
  phone, onPhoneChange,
  promoInput, onPromoInputChange,
  promoExpanded, onPromoToggle,
  promoDiscount, promoError, promoApplied,
  onPromoValidate, promoValidating,
  paymentMethod, onPaymentChange,
  agreed, onAgreedChange,
  hasSubscription,
  errors,
}: {
  service: typeof SERVICES[0] | undefined;
  address: Address | undefined;
  useNewAddress: boolean;
  newAddress: NewAddressForm;
  date: string; timeSlot: string; recurring: string;
  phone: string; onPhoneChange: (v: string) => void;
  promoInput: string; onPromoInputChange: (v: string) => void;
  promoExpanded: boolean; onPromoToggle: () => void;
  promoDiscount: number; promoError: string; promoApplied: boolean;
  onPromoValidate: () => void; promoValidating: boolean;
  paymentMethod: string; onPaymentChange: (v: string) => void;
  agreed: boolean; onAgreedChange: (v: boolean) => void;
  hasSubscription: boolean;
  errors: Record<string, string>;
}) {
  const base = 3500;
  const subOff = hasSubscription ? Math.round(base * 0.1) : 0;
  const promoOff = promoApplied ? Math.round((base - subOff) * (promoDiscount / 100)) : 0;
  const total = base - subOff - promoOff;
  const recurringLabel = RECURRING_OPTIONS.find(o => o.value === recurring)?.label ?? "Разово";
  const addrLine = useNewAddress ? newAddress.fullAddress : (address?.address ?? "");

  return (
    <div className="space-y-4">
      {/* Summary card */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-3.5">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Детали заказа</p>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{service?.icon}</span>
          <div>
            <p className="font-semibold text-sm text-gray-900">{service?.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{recurringLabel}</p>
          </div>
        </div>
        {addrLine && (
          <div className="flex items-start gap-2.5">
            <svg className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm text-gray-700">{addrLine}</p>
          </div>
        )}
        <div className="flex items-center gap-2.5">
          <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-gray-700">
            {cap(formatDateLong(date))} · <span className="font-semibold">{timeSlot}</span>
          </p>
        </div>
      </div>

      {/* Phone */}
      <Field label="Номер телефона для связи">
        <input
          type="tel"
          value={phone}
          onChange={e => onPhoneChange(e.target.value)}
          placeholder="+7 (999) 000-00-00"
          className={inputCls(false)}
        />
        <p className="text-xs text-gray-400 mt-1">Менеджер свяжется за 30 минут до визита</p>
      </Field>

      {/* Pricing */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Стоимость</p>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Базовая стоимость</span>
          <span>{base.toLocaleString("ru")} ₽</span>
        </div>
        {subOff > 0 && (
          <div className="flex justify-between text-sm text-[#1D9E75]">
            <span>Скидка по подписке (10%)</span>
            <span>−{subOff.toLocaleString("ru")} ₽</span>
          </div>
        )}
        {promoOff > 0 && (
          <div className="flex justify-between text-sm text-[#1D9E75]">
            <span>Промокод ({promoDiscount}%)</span>
            <span>−{promoOff.toLocaleString("ru")} ₽</span>
          </div>
        )}
        <div className="flex justify-between items-center font-bold text-gray-900 border-t border-gray-200 pt-2.5 mt-1">
          <span className="text-sm">Итого</span>
          <span className="text-xl">{total.toLocaleString("ru")} ₽</span>
        </div>
        <p className="text-xs text-gray-400">Точная стоимость будет согласована с менеджером</p>
      </div>

      {/* Promo code */}
      <div>
        <button onClick={onPromoToggle} className="text-sm text-[#1D9E75] font-medium hover:underline flex items-center gap-1">
          <svg className={`h-3.5 w-3.5 transition-transform ${promoExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {promoApplied ? `Промокод применён (−${promoDiscount}%)` : "У меня есть промокод"}
        </button>
        {promoExpanded && !promoApplied && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={promoInput}
              onChange={e => onPromoInputChange(e.target.value.toUpperCase())}
              placeholder="DOMAS10"
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1D9E75] bg-gray-50"
            />
            <button
              onClick={onPromoValidate}
              disabled={promoValidating || !promoInput.trim()}
              className="px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-40 whitespace-nowrap"
            >
              {promoValidating ? "..." : "Применить"}
            </button>
          </div>
        )}
        {promoError && <p className="text-xs text-red-500 mt-1.5">{promoError}</p>}
      </div>

      {/* Payment method */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Способ оплаты</p>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { value: "cash", label: "При визите", icon: "💵", sub: "Наличными или картой" },
            { value: "card", label: "Оплатить картой", icon: "💳", sub: "Безопасная оплата" },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => onPaymentChange(opt.value)}
              className={[
                "flex flex-col items-center gap-1 py-3.5 px-2 rounded-2xl border-2 transition-all text-center",
                paymentMethod === opt.value
                  ? "border-[#1D9E75] bg-[#f0faf6] shadow-sm"
                  : "border-gray-100 bg-gray-50 hover:border-gray-200",
              ].join(" ")}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className="text-xs font-semibold text-gray-800 leading-tight">{opt.label}</span>
              <span className="text-[10px] text-gray-400">{opt.sub}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <svg className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-[11px] text-gray-400">Платёж защищён 256-bit SSL</span>
        </div>
      </div>

      {/* Legal */}
      <label className="flex items-start gap-3 cursor-pointer">
        <button
          type="button"
          onClick={() => onAgreedChange(!agreed)}
          className={[
            "mt-0.5 h-5 w-5 rounded-md flex items-center justify-center flex-shrink-0 border-2 transition-all",
            agreed ? "bg-[#1D9E75] border-[#1D9E75]" : "border-gray-300 bg-white",
          ].join(" ")}
          role="checkbox"
          aria-checked={agreed}
        >
          {agreed && (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <span className="text-xs text-gray-500 leading-relaxed">
          Я согласен(а) с{" "}
          <a href="/terms" className="text-[#1D9E75] underline hover:no-underline" target="_blank" rel="noopener">
            условиями оказания услуг
          </a>{" "}
          и обработкой персональных данных
        </span>
      </label>
      {errors.agreed && <p className="text-xs text-red-500 -mt-2">{errors.agreed}</p>}
    </div>
  );
}

// ─── Success Screen ────────────────────────────────────────────────
function SuccessScreen({
  orderNumber, service, date, timeSlot, onClose,
}: {
  orderNumber: string;
  service: typeof SERVICES[0] | undefined;
  date: string; timeSlot: string;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center py-6 px-2">
      <div className="h-20 w-20 rounded-full bg-[#e8f7f2] flex items-center justify-center mb-5">
        <svg className="h-10 w-10 text-[#1D9E75]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="font-raleway font-black text-2xl text-gray-900 mb-2">Заявка принята!</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-1 max-w-xs">
        Менеджер свяжется с вами в течение <strong className="text-gray-800">5 минут</strong> для подтверждения визита
      </p>
      <p className="text-xs text-gray-400 mb-6">
        Номер заявки: <span className="font-mono font-bold text-gray-600">#{orderNumber}</span>
      </p>
      <div className="w-full bg-gray-50 rounded-2xl p-4 text-left space-y-2.5 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{service?.icon}</span>
          <span className="font-semibold text-sm text-gray-800">{service?.title}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {cap(formatDateLong(date))} · <span className="font-semibold text-gray-700">{timeSlot}</span>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2.5">
        <a
          href="/dashboard/orders"
          className="w-full h-12 bg-[#1D9E75] text-white font-semibold rounded-xl flex items-center justify-center text-sm hover:bg-[#1D9E75]/90 transition-colors"
        >
          Мои заказы
        </a>
        <button
          onClick={onClose}
          className="w-full h-12 bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-200 transition-colors"
        >
          Вернуться в кабинет
        </button>
      </div>
    </div>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────
function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return [
    "w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] transition-all",
    hasError ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:bg-white",
  ].join(" ");
}

// ─── BookingModal ─────────────────────────────────────────────────
export function BookingModal({
  isOpen, onClose, initialServiceId,
  user, addresses, subscription, onSuccess,
}: Props) {
  const [step, setStep] = useState<Step>(initialServiceId ? 2 : 1);
  const [visible, setVisible] = useState(true);
  const [orderNumber, setOrderNumber] = useState("");

  const [serviceId, setServiceId] = useState(initialServiceId ?? "");
  const [addressId, setAddressId] = useState<string | null>(
    addresses.find(a => a.isDefault)?.id ?? addresses[0]?.id ?? null
  );
  const [useNewAddress, setUseNewAddress] = useState(addresses.length === 0);
  const [newAddress, setNewAddress] = useState<NewAddressForm>({
    fullAddress: "", city: "", landmark: "", label: "Дом", save: false,
  });
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [recurring, setRecurring] = useState("once");
  const [specialRequests, setSpecialRequests] = useState("");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [agreed, setAgreed] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoExpanded, setPromoExpanded] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoValidating, setPromoValidating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfetti, setShowConfetti] = useState(false);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      const initStep: Step = initialServiceId ? 2 : 1;
      setStep(initStep);
      setVisible(true);
      setServiceId(initialServiceId ?? "");
      setAddressId(addresses.find(a => a.isDefault)?.id ?? addresses[0]?.id ?? null);
      setUseNewAddress(addresses.length === 0);
      setNewAddress({ fullAddress: "", city: "", landmark: "", label: "Дом", save: false });
      setDate("");
      setTimeSlot("");
      setRecurring("once");
      setSpecialRequests("");
      setPhone(user.phone ?? "");
      setPaymentMethod("cash");
      setAgreed(false);
      setPromoInput("");
      setPromoExpanded(false);
      setPromoDiscount(0);
      setPromoError("");
      setErrors({});
      setShowConfetti(false);
    }
  }, [isOpen, initialServiceId, addresses, user.phone]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen]);

  const service = SERVICES.find(s => s.id === serviceId);
  const selectedAddress = addresses.find(a => a.id === addressId);

  function navigate(toStep: Step) {
    setVisible(false);
    setTimeout(() => {
      setStep(toStep);
      setVisible(true);
    }, 180);
  }

  function validate(s: Step): boolean {
    const errs: Record<string, string> = {};
    if (s === 1 && !serviceId) errs.serviceId = "Выберите услугу";
    if (s === 2) {
      if (useNewAddress) {
        if (!newAddress.fullAddress.trim()) errs.fullAddress = "Введите адрес";
        if (!newAddress.city.trim()) errs.city = "Введите населённый пункт";
      } else if (!addressId) {
        errs.addressId = "Выберите адрес";
      }
    }
    if (s === 3) {
      if (!date) errs.date = "Выберите дату";
      if (!timeSlot) errs.timeSlot = "Выберите удобное время";
    }
    if (s === 4 && !agreed) errs.agreed = "Необходимо согласие с условиями";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleNext() {
    if (typeof step !== "number") return;
    if (!validate(step)) return;
    if (step === 4) { await handleSubmit(); return; }
    navigate((step + 1) as Step);
  }

  function handleBack() {
    if (typeof step !== "number" || step <= 1) return;
    navigate((step - 1) as Step);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      // If save is true, address was already saved via the modal — otherwise pass inline
      const body: Record<string, unknown> = {
        serviceType: serviceId,
        scheduledAt: date,
        timeSlot,
        isRecurring: recurring !== "once",
        recurringType: recurring,
        specialRequests: specialRequests || null,
        promoCode: promoDiscount > 0 ? promoInput : null,
        paymentMethod,
      };

      if (!useNewAddress) {
        body.addressId = addressId;
      } else if (newAddress.save) {
        // Address will be created by the API using newAddress
        body.newAddress = {
          fullAddress: newAddress.fullAddress,
          city: newAddress.city,
          landmark: newAddress.landmark,
          label: newAddress.label,
        };
      } else {
        body.newAddress = {
          fullAddress: newAddress.fullAddress,
          city: newAddress.city,
          landmark: newAddress.landmark,
          label: newAddress.label ?? "Адрес",
        };
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка оформления заказа");

      setOrderNumber(data.data?.orderNumber ?? `DOMAS-${Math.floor(1000 + Math.random() * 9000)}`);
      setShowConfetti(true);
      navigate("success");
      setTimeout(() => setShowConfetti(false), 2800);
      onSuccess?.();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePromoValidate() {
    if (!promoInput.trim()) return;
    setPromoValidating(true);
    setPromoError("");
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput, serviceId }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setPromoDiscount(data.discount);
      } else {
        setPromoError(data.error ?? "Промокод не найден");
      }
    } catch {
      setPromoError("Ошибка проверки промокода");
    } finally {
      setPromoValidating(false);
    }
  }

  function handleClose() {
    if (step !== 1 && step !== "success") {
      if (!confirm("Закрыть? Введённые данные не сохранятся.")) return;
    }
    onClose();
  }

  if (!isOpen) return null;

  const stepNum = typeof step === "number" ? step : 5;
  const stepTitle =
    step === "success" ? "Заявка принята!" :
    step === 1 ? "Выберите услугу" :
    step === 2 ? "Адрес визита" :
    step === 3 ? "Дата и время" :
    "Подтверждение и оплата";

  return (
    <>
      {showConfetti && <Confetti />}

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center"
        onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
      >
        {/* Sheet / Modal */}
        <div className="
          w-full sm:max-w-[600px] bg-white
          rounded-t-3xl sm:rounded-2xl
          max-h-[92vh] sm:max-h-[85vh]
          flex flex-col shadow-2xl
          overflow-hidden
        ">
          {/* ── Header ── */}
          <div className="flex-shrink-0 px-5 pt-4 pb-3 border-b border-gray-100">
            {/* Mobile drag handle */}
            <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4 sm:hidden" aria-hidden />

            {/* Step indicator */}
            {step !== "success" && (
              <div className="flex items-center mb-3">
                {STEP_LABELS.map((label, i) => {
                  const n = i + 1;
                  const done = stepNum > n;
                  const active = stepNum === n;
                  return (
                    <div key={label} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-1">
                        <div className={[
                          "h-6 w-6 rounded-full text-[11px] font-bold flex items-center justify-center transition-all duration-300",
                          done ? "bg-[#1D9E75] text-white" :
                          active ? "bg-[#1D9E75] text-white ring-4 ring-[#1D9E75]/20" :
                          "bg-gray-100 text-gray-400",
                        ].join(" ")}>
                          {done ? (
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : n}
                        </div>
                        <span className={[
                          "text-[9px] font-semibold whitespace-nowrap leading-none",
                          active || done ? "text-[#1D9E75]" : "text-gray-400",
                        ].join(" ")}>
                          {label}
                        </span>
                      </div>
                      {i < 3 && (
                        <div className={[
                          "flex-1 h-px mx-1.5 mb-3 transition-all duration-300",
                          done ? "bg-[#1D9E75]" : "bg-gray-200",
                        ].join(" ")} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Title row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                {typeof step === "number" && step > 1 && (
                  <button
                    onClick={handleBack}
                    className="p-1.5 -ml-1 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <h2 className="font-raleway font-bold text-lg text-gray-900 truncate">{stepTitle}</h2>
              </div>
              <button
                onClick={handleClose}
                className="flex-shrink-0 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Закрыть"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Content ── */}
          <div
            className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 transition-opacity duration-150"
            style={{ opacity: visible ? 1 : 0 }}
          >
            {step === 1 && (
              <Step1
                selected={serviceId}
                onSelect={id => { setServiceId(id); }}
                hasSubscription={!!subscription}
              />
            )}
            {step === 2 && (
              <Step2
                addresses={addresses}
                selected={addressId}
                onSelect={setAddressId}
                useNew={useNewAddress}
                onToggleNew={v => { setUseNewAddress(v); if (v) setAddressId(null); }}
                newForm={newAddress}
                onNewFormChange={setNewAddress}
                errors={errors}
              />
            )}
            {step === 3 && (
              <Step3
                date={date} onDateSelect={d => { setDate(d); setTimeSlot(""); }}
                timeSlot={timeSlot} onTimeSlotSelect={setTimeSlot}
                recurring={recurring} onRecurringChange={setRecurring}
                specialRequests={specialRequests} onSpecialChange={setSpecialRequests}
                isSubscription={!!service?.isPrimarySubscription}
                errors={errors}
              />
            )}
            {step === 4 && (
              <Step4
                service={service}
                address={selectedAddress}
                useNewAddress={useNewAddress}
                newAddress={newAddress}
                date={date} timeSlot={timeSlot} recurring={recurring}
                phone={phone} onPhoneChange={setPhone}
                promoInput={promoInput} onPromoInputChange={setPromoInput}
                promoExpanded={promoExpanded} onPromoToggle={() => setPromoExpanded(v => !v)}
                promoDiscount={promoDiscount} promoError={promoError}
                promoApplied={promoDiscount > 0}
                onPromoValidate={handlePromoValidate} promoValidating={promoValidating}
                paymentMethod={paymentMethod} onPaymentChange={setPaymentMethod}
                agreed={agreed} onAgreedChange={setAgreed}
                hasSubscription={!!subscription}
                errors={errors}
              />
            )}
            {step === "success" && (
              <SuccessScreen
                orderNumber={orderNumber}
                service={service}
                date={date}
                timeSlot={timeSlot}
                onClose={onClose}
              />
            )}
          </div>

          {/* ── Footer CTA ── */}
          {step !== "success" && (
            <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100 bg-white">
              <button
                onClick={handleNext}
                disabled={submitting}
                className="w-full h-13 min-h-[52px] bg-[#1D9E75] hover:bg-[#1D9E75]/90 active:scale-[0.99] text-white font-semibold rounded-xl transition-all duration-150 flex items-center justify-center gap-2 text-base disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Обрабатываем заказ...
                  </>
                ) : step === 4 ? (
                  "Оформить заказ"
                ) : (
                  "Далее"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
