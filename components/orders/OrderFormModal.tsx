"use client";

import { useState, useEffect, useRef } from "react";
import { SERVICES } from "@/constants/services";
import { SERVICE_LABELS } from "@/constants/services";

// ─── Types ────────────────────────────────────────────────────

interface Address {
  id: string;
  label: string;
  address: string;
  city?: string | null;
  landmark?: string | null;
  isDefault: boolean;
}

interface OrderFormModalProps {
  onClose: () => void;
  preselectedService?: string;
}

type Step = 1 | 2 | 3 | 4 | 5;

// ─── Constants ────────────────────────────────────────────────

const TIME_SLOTS = [
  "08:00–10:00",
  "10:00–12:00",
  "12:00–14:00",
  "14:00–16:00",
  "16:00–18:00",
];

const BOOKABLE_SERVICES = SERVICES.filter((s) => !s.isPrimarySubscription);

// ─── Calendar helpers ─────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Mon=0
}

const MONTHS_RU = [
  "Январь","Февраль","Март","Апрель","Май","Июнь",
  "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь",
];
const DAYS_RU = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

// ─── Step indicator ───────────────────────────────────────────

function StepDot({ n, current }: { n: number; current: Step }) {
  const done = n < current;
  const active = n === current;
  return (
    <div className="flex items-center gap-0">
      <div
        className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
          done
            ? "bg-brand-green text-white"
            : active
            ? "bg-brand-green text-white ring-4 ring-brand-green/20"
            : "bg-white/[0.08] text-white/30"
        }`}
      >
        {done ? (
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : n}
      </div>
    </div>
  );
}

function StepIndicator({ current }: { current: Step }) {
  const totalSteps = 5;
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <StepDot n={i + 1} current={current} />
          {i < totalSteps - 1 && (
            <div className={`h-px w-6 transition-all duration-300 ${i + 1 < current ? "bg-brand-green" : "bg-white/[0.10]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step labels ──────────────────────────────────────────────

const STEP_LABELS: Record<Step, string> = {
  1: "Услуга",
  2: "Адрес",
  3: "Дата и время",
  4: "Детали",
  5: "Подтверждение",
};

// ─── Main Component ───────────────────────────────────────────

export function OrderFormModal({ onClose, preselectedService }: OrderFormModalProps) {
  const initialStep: Step = preselectedService ? 2 : 1;

  const [step, setStep] = useState<Step>(initialStep);
  const [serviceId, setServiceId] = useState<string>(preselectedService ?? "");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState<string>("");
  const [newAddress, setNewAddress] = useState({ fullAddress: "", label: "", landmark: "" });
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [calMonth, setCalMonth] = useState(() => {
    const n = new Date();
    return { year: n.getFullYear(), month: n.getMonth() };
  });
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Fetch saved addresses
  useEffect(() => {
    fetch("/api/user/addresses")
      .then((r) => r.json())
      .then((j) => {
        const list: Address[] = j.data ?? [];
        setAddresses(list);
        const def = list.find((a) => a.isDefault);
        if (def) setAddressId(def.id);
      });
  }, []);

  // Close on Escape + lock the dashboard scroll container on iOS
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);

    // Block the dashboard scroll container so iOS can't scroll behind the modal
    const scrollEl = document.getElementById("dash-scroll");
    if (scrollEl) scrollEl.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handler);
      if (scrollEl) scrollEl.style.overflow = "";
    };
  }, [onClose]);

  // ── Photo upload ────────────────────────────────────────────

  function handlePhotos(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const b64 = e.target?.result as string;
        setPhotos((prev) => [...prev, b64]);
      };
      reader.readAsDataURL(file);
    });
  }

  // ── Calendar ────────────────────────────────────────────────

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function isoDate(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function prevMonth() {
    setCalMonth((c) => {
      if (c.month === 0) return { year: c.year - 1, month: 11 };
      return { year: c.year, month: c.month - 1 };
    });
  }

  function nextMonth() {
    setCalMonth((c) => {
      if (c.month === 11) return { year: c.year + 1, month: 0 };
      return { year: c.year, month: c.month + 1 };
    });
  }

  // ── Submit ──────────────────────────────────────────────────

  async function handleSubmit() {
    setError("");
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        serviceType: serviceId,
        scheduledAt: selectedDate,
        timeSlot,
        specialRequests: comment || null,
        photos,
        paymentMethod: "cash",
      };
      if (addressId) {
        payload.addressId = addressId;
      } else if (newAddress.fullAddress) {
        payload.newAddress = {
          fullAddress: newAddress.fullAddress,
          label: newAddress.label || "Мой адрес",
          landmark: newAddress.landmark || null,
        };
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Ошибка");
      setOrderNumber(json.data?.orderNumber ?? "");
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка при отправке");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Validation ──────────────────────────────────────────────

  function canGoNext(): boolean {
    if (step === 1) return !!serviceId;
    if (step === 2) return !!addressId || !!newAddress.fullAddress;
    if (step === 3) return !!selectedDate && !!timeSlot;
    return true;
  }

  function goNext() {
    if (!canGoNext()) return;
    setStep((s) => Math.min(5, s + 1) as Step);
  }

  function goBack() {
    setStep((s) => Math.max(initialStep, s - 1) as Step);
  }

  const selectedService = SERVICES.find((s) => s.id === serviceId);
  const selectedAddress = addresses.find((a) => a.id === addressId);

  // ── Render ──────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-[70] flex sm:items-center sm:justify-center sm:p-4">
      {/* Backdrop — только на десктопе */}
      <div className="hidden sm:block absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Модал — полный экран на мобиле, центр на десктопе */}
      <div
        className="relative w-full h-full sm:h-auto sm:max-w-xl bg-[#0F1A16] sm:border border-white/[0.08] sm:rounded-2xl shadow-2xl flex flex-col sm:max-h-[90dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 border-b border-white/[0.06] flex-shrink-0"
          style={{ paddingTop: "max(1.25rem, env(safe-area-inset-top))" }}
        >
          <div>
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-1">
              {STEP_LABELS[step]}
            </p>
            <StepIndicator current={step} />
          </div>
          <button
            onClick={onClose}
            className="h-11 w-11 rounded-full bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.12] transition-all touch-manipulation"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5 min-h-0"
          style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          {submitted ? (
            <SuccessView orderNumber={orderNumber} onClose={onClose} />
          ) : step === 1 ? (
            <StepService selected={serviceId} onSelect={setServiceId} />
          ) : step === 2 ? (
            <StepAddress
              addresses={addresses}
              selectedId={addressId}
              onSelect={(id) => { setAddressId(id); setShowNewAddressForm(false); }}
              showNew={showNewAddressForm}
              onShowNew={() => { setAddressId(""); setShowNewAddressForm(true); }}
              newAddress={newAddress}
              onNewAddressChange={setNewAddress}
            />
          ) : step === 3 ? (
            <StepDateTime
              calMonth={calMonth}
              onPrevMonth={prevMonth}
              onNextMonth={nextMonth}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              timeSlot={timeSlot}
              onSelectSlot={setTimeSlot}
              today={today}
              isoDate={isoDate}
            />
          ) : step === 4 ? (
            <StepDetails
              comment={comment}
              onCommentChange={setComment}
              photos={photos}
              onPhotos={handlePhotos}
              onRemovePhoto={(i) => setPhotos((p) => p.filter((_, idx) => idx !== i))}
              fileRef={fileRef}
            />
          ) : (
            <StepConfirm
              service={selectedService}
              address={selectedAddress}
              newAddress={newAddress.fullAddress ? newAddress : undefined}
              selectedDate={selectedDate}
              timeSlot={timeSlot}
              comment={comment}
              photos={photos}
              error={error}
            />
          )}
        </div>

        {/* Footer nav */}
        {!submitted && (
          <div className="px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-white/[0.06] flex gap-3 flex-shrink-0">
            {step > initialStep && (
              <button
                onClick={goBack}
                className="flex-1 py-4 rounded-xl border border-white/[0.10] text-white/50 hover:text-white hover:border-white/20 text-sm font-semibold transition-all touch-manipulation"
              >
                Назад
              </button>
            )}
            {step < 5 ? (
              <button
                onClick={goNext}
                disabled={!canGoNext()}
                className="flex-1 py-4 rounded-xl bg-brand-green hover:bg-brand-green/90 text-white text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation"
              >
                Далее
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-4 rounded-xl bg-brand-green hover:bg-brand-green/90 text-white text-sm font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2 touch-manipulation"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Отправляем...
                  </>
                ) : "Оформить заявку"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 1: Service ──────────────────────────────────────────

function StepService({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-white/50 text-sm mb-4">Выберите услугу, которую хотите заказать</p>
      {BOOKABLE_SERVICES.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
            selected === s.id
              ? "border-brand-green bg-brand-green/[0.08]"
              : "border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
          }`}
        >
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ backgroundColor: s.bgColor + "20" }}
          >
            {s.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className={`font-semibold text-sm ${selected === s.id ? "text-white" : "text-white/80"}`}>
              {s.title}
            </p>
            <p className="text-white/30 text-xs mt-0.5 line-clamp-1">{s.frequency}</p>
          </div>
          {selected === s.id && (
            <div className="h-5 w-5 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0">
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Step 2: Address ──────────────────────────────────────────

function StepAddress({
  addresses, selectedId, onSelect, showNew, onShowNew, newAddress, onNewAddressChange,
}: {
  addresses: Address[];
  selectedId: string;
  onSelect: (id: string) => void;
  showNew: boolean;
  onShowNew: () => void;
  newAddress: { fullAddress: string; label: string; landmark: string };
  onNewAddressChange: (v: { fullAddress: string; label: string; landmark: string }) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-white/50 text-sm mb-4">Укажите адрес объекта</p>

      {addresses.map((addr) => (
        <button
          key={addr.id}
          onClick={() => onSelect(addr.id)}
          className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${
            selectedId === addr.id
              ? "border-brand-green bg-brand-green/[0.08]"
              : "border-white/[0.08] bg-white/[0.03] hover:border-white/20"
          }`}
        >
          <div className="h-8 w-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/80 font-semibold text-sm">{addr.label}</p>
            <p className="text-white/40 text-xs mt-0.5 truncate">{addr.address}</p>
            {addr.isDefault && (
              <span className="text-xs text-brand-green font-semibold">По умолчанию</span>
            )}
          </div>
          {selectedId === addr.id && (
            <div className="h-5 w-5 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0">
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>
      ))}

      <button
        onClick={onShowNew}
        className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
          showNew
            ? "border-brand-green bg-brand-green/[0.08]"
            : "border-dashed border-white/20 hover:border-white/40 bg-white/[0.02]"
        }`}
      >
        <div className="h-8 w-8 rounded-lg bg-brand-green/20 flex items-center justify-center flex-shrink-0">
          <svg className="h-4 w-4 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <span className="text-white/60 text-sm font-medium">Добавить новый адрес</span>
      </button>

      {showNew && (
        <div className="space-y-3 pt-1">
          <Input
            label="Адрес объекта *"
            placeholder="Московская обл., пос. Малаховка, ул. Садовая, 12"
            value={newAddress.fullAddress}
            onChange={(v) => onNewAddressChange({ ...newAddress, fullAddress: v })}
          />
          <Input
            label="Название (для справки)"
            placeholder="Дача, Загородный дом..."
            value={newAddress.label}
            onChange={(v) => onNewAddressChange({ ...newAddress, label: v })}
          />
          <Input
            label="Ориентир"
            placeholder="Напротив магазина, зелёные ворота..."
            value={newAddress.landmark}
            onChange={(v) => onNewAddressChange({ ...newAddress, landmark: v })}
          />
        </div>
      )}
    </div>
  );
}

// ─── Step 3: Date & Time ──────────────────────────────────────

function StepDateTime({
  calMonth, onPrevMonth, onNextMonth, selectedDate, onSelectDate,
  timeSlot, onSelectSlot, today, isoDate,
}: {
  calMonth: { year: number; month: number };
  onPrevMonth: () => void;
  onNextMonth: () => void;
  selectedDate: string;
  onSelectDate: (d: string) => void;
  timeSlot: string;
  onSelectSlot: (s: string) => void;
  today: Date;
  isoDate: (y: number, m: number, d: number) => string;
}) {
  const { year, month } = calMonth;
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const blanks = Array.from({ length: firstDay });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isPast = (day: number) => {
    const d = new Date(year, month, day);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const nowYM = { year: today.getFullYear(), month: today.getMonth() };
  const canPrev = year > nowYM.year || (year === nowYM.year && month > nowYM.month);

  return (
    <div className="space-y-5">
      {/* Calendar */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onPrevMonth}
            disabled={!canPrev}
            className="h-10 w-10 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.10] transition-all disabled:opacity-20 disabled:cursor-not-allowed touch-manipulation"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <span className="text-white font-semibold text-sm">
            {MONTHS_RU[month]} {year}
          </span>
          <button
            onClick={onNextMonth}
            className="h-10 w-10 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.10] transition-all touch-manipulation"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {DAYS_RU.map((d) => (
            <div key={d} className="text-center text-white/20 text-[11px] font-bold uppercase py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {blanks.map((_, i) => <div key={`b${i}`} />)}
          {days.map((day) => {
            const iso = isoDate(year, month, day);
            const past = isPast(day);
            const sel = selectedDate === iso;
            return (
              <button
                key={day}
                disabled={past}
                onClick={() => onSelectDate(iso)}
                className={`aspect-square rounded-lg text-sm font-semibold transition-all duration-150 ${
                  sel
                    ? "bg-brand-green text-white"
                    : past
                    ? "text-white/15 cursor-not-allowed"
                    : "text-white/60 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-3">
            Выберите время
          </p>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                onClick={() => onSelectSlot(slot)}
                className={`py-3 rounded-xl text-xs font-semibold border transition-all duration-150 touch-manipulation ${
                  timeSlot === slot
                    ? "bg-brand-green border-brand-green text-white"
                    : "border-white/[0.10] text-white/50 hover:border-white/30 hover:text-white bg-white/[0.03]"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 4: Details ──────────────────────────────────────────

function StepDetails({
  comment, onCommentChange, photos, onPhotos, onRemovePhoto, fileRef,
}: {
  comment: string;
  onCommentChange: (v: string) => void;
  photos: string[];
  onPhotos: (files: FileList | null) => void;
  onRemovePhoto: (i: number) => void;
  fileRef: React.RefObject<HTMLInputElement>;
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-3">
          Комментарий
        </p>
        <textarea
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Опишите особенности объекта, пожелания или вопросы..."
          rows={4}
          className="w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-4 py-3 text-white placeholder-white/20 text-base focus:outline-none focus:border-brand-green/50 resize-none transition-colors"
        />
      </div>

      <div>
        <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-3">
          Фотографии объекта
        </p>

        <div className="flex gap-3 flex-wrap">
          {photos.map((src, i) => (
            <div key={i} className="relative h-20 w-20 rounded-xl overflow-hidden border border-white/[0.10]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                onClick={() => onRemovePhoto(i)}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/70 flex items-center justify-center touch-manipulation"
              >
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}

          <button
            onClick={() => fileRef.current?.click()}
            className="h-20 w-20 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center gap-1 hover:border-white/40 transition-colors touch-manipulation"
          >
            <svg className="h-5 w-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="text-white/20 text-xs">Фото</span>
          </button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onPhotos(e.target.files)}
        />
        <p className="text-white/20 text-xs mt-2">До 5 МБ на файл · можно добавить любое количество</p>
        <div className="flex items-start gap-2 mt-3 bg-white/[0.04] border border-white/[0.10] rounded-xl px-3 py-2.5">
          <svg className="h-4 w-4 text-white/40 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-white/50 text-xs leading-relaxed">
            Фотографии <span className="font-semibold text-white/80">максимально важны</span> для точного расчёта стоимости. Чем больше деталей — тем точнее будет расчёт стоимости.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Step 5: Confirm ──────────────────────────────────────────

function StepConfirm({
  service, address, newAddress, selectedDate, timeSlot, comment, photos, error,
}: {
  service?: (typeof SERVICES)[0];
  address?: Address;
  newAddress?: { fullAddress: string; label: string; landmark: string };
  selectedDate: string;
  timeSlot: string;
  comment: string;
  photos: string[];
  error: string;
}) {
  const dateStr = selectedDate
    ? new Date(selectedDate + "T12:00:00").toLocaleDateString("ru-RU", {
        weekday: "long", day: "numeric", month: "long",
      })
    : "";

  const addrLine = address
    ? address.address
    : newAddress?.fullAddress ?? "—";

  return (
    <div className="space-y-4">
      <p className="text-white/50 text-sm">Проверьте детали заявки перед отправкой</p>

      <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl divide-y divide-white/[0.06]">
        <SummaryRow label="Услуга" value={service?.title ?? "—"} />
        <SummaryRow label="Адрес" value={addrLine} />
        <SummaryRow label="Дата" value={dateStr} />
        <SummaryRow label="Время" value={timeSlot} />
        {comment && <SummaryRow label="Комментарий" value={comment} />}
        {photos.length > 0 && <SummaryRow label="Фото" value={`${photos.length} шт.`} />}
      </div>

      <div className="bg-brand-green/[0.06] border border-brand-green/20 rounded-xl p-4">
        <p className="text-brand-green-light text-xs leading-relaxed">
          После отправки мы рассмотрим вашу заявку и свяжемся с вами для согласования деталей.
          Точная стоимость будет подтверждена администратором в течение 10 минут.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <span className="text-white/30 text-xs w-24 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-white/80 text-sm">{value}</span>
    </div>
  );
}

// ─── Success view ─────────────────────────────────────────────

function SuccessView({ orderNumber, onClose }: { orderNumber: string; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="h-16 w-16 rounded-full bg-brand-green/20 border border-brand-green/30 flex items-center justify-center mb-5 animate-pulse">
        <svg className="h-8 w-8 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="font-raleway font-black text-xl text-white mb-2">Заявка отправлена!</h3>
      {orderNumber && (
        <p className="text-brand-green font-mono font-bold text-sm mb-3">{orderNumber}</p>
      )}
      <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
        Мы свяжемся с вами в ближайшее время для подтверждения деталей и стоимости.
      </p>
      <button
        onClick={onClose}
        className="w-full py-3 rounded-xl bg-brand-green hover:bg-brand-green/90 text-white font-bold text-sm transition-all"
      >
        Отлично, жду!
      </button>
    </div>
  );
}

// ─── Helper input ─────────────────────────────────────────────

function Input({
  label, placeholder, value, onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-white/30 text-xs font-bold uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-4 py-3 text-white placeholder-white/20 text-base focus:outline-none focus:border-brand-green/50 transition-colors"
      />
    </div>
  );
}
