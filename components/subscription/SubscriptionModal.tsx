"use client";

import { useState, useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PLANS = [
  {
    id: "BASIC",
    name: "Базовый",
    price: 1490,
    desc: "Еженедельный вывоз ТКО по расписанию",
    features: ["Вывоз мусора еженедельно", "Уведомления о визитах", "Скидка 10% на доп. услуги"],
  },
  {
    id: "COMFORT",
    name: "Комфорт",
    price: 3490,
    desc: "Базовый + 2 дополнительные услуги в месяц",
    features: ["Всё из Базового", "2 доп. услуги на выбор", "Приоритетный выезд"],
    popular: true,
  },
  {
    id: "MAX",
    name: "Максимум",
    price: 5990,
    desc: "Полное обслуживание дома без ограничений",
    features: ["Всё из Комфорт", "Неограниченные доп. услуги", "Персональный менеджер"],
  },
];

export function SubscriptionModal({ isOpen, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [plan, setPlan] = useState("BASIC");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [landmark, setLandmark] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPlan("BASIC");
      setAddress("");
      setCity("");
      setLandmark("");
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen]);

  function handleNext() {
    if (step === 1) { setStep(2); return; }
    handleSubmit();
  }

  async function handleSubmit() {
    const errs: Record<string, string> = {};
    if (!address.trim()) errs.address = "Введите адрес";
    if (!city.trim()) errs.city = "Введите населённый пункт";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, address, city, landmark }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка");
      onSuccess();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  const selectedPlan = PLANS.find(p => p.id === plan)!;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full sm:max-w-[560px] bg-white rounded-t-3xl sm:rounded-2xl max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex-shrink-0 px-5 pt-4 pb-3 border-b border-gray-100">
          <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4 sm:hidden" />

          {/* Steps */}
          <div className="flex items-center gap-2 mb-3">
            {["Выбор тарифа", "Адрес"].map((label, i) => {
              const n = i + 1;
              const done = step > n;
              const active = step === n;
              return (
                <div key={label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div className={[
                      "h-6 w-6 rounded-full text-[11px] font-bold flex items-center justify-center transition-all",
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
                    <span className={`text-[9px] font-semibold ${active || done ? "text-[#1D9E75]" : "text-gray-400"}`}>
                      {label}
                    </span>
                  </div>
                  {i < 1 && (
                    <div className={`flex-1 h-px mx-2 mb-3 ${done ? "bg-[#1D9E75]" : "bg-gray-200"}`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {step === 2 && (
                <button onClick={() => setStep(1)} className="p-1.5 -ml-1 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <h2 className="font-raleway font-bold text-lg text-gray-900">
                {step === 1 ? "Выберите тариф" : "Адрес обслуживания"}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto px-5 py-5"
        >
          {step === 1 && (
            <div className="space-y-3">
              {PLANS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPlan(p.id)}
                  className={[
                    "w-full text-left p-4 rounded-2xl border-2 transition-all duration-150",
                    plan === p.id
                      ? "border-[#1D9E75] bg-[#f0faf6]"
                      : "border-gray-100 bg-gray-50/60 hover:border-gray-200 hover:bg-white",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-raleway font-black text-base text-gray-900">{p.name}</span>
                        {p.popular && (
                          <span className="text-[10px] font-bold text-[#1D9E75] bg-[#e8f7f2] px-2 py-0.5 rounded-full">
                            Популярный
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs mb-2">{p.desc}</p>
                      <ul className="space-y-1">
                        {p.features.map(f => (
                          <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                            <svg className="h-3 w-3 text-[#1D9E75] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-raleway font-black text-xl text-gray-900">
                        {p.price.toLocaleString("ru")} ₽
                      </p>
                      <p className="text-xs text-gray-400">/мес</p>
                    </div>
                  </div>
                  {plan === p.id && (
                    <div className="mt-2 pt-2 border-t border-[#1D9E75]/20 flex items-center gap-1.5">
                      <div className="h-4 w-4 rounded-full bg-[#1D9E75] flex items-center justify-center flex-shrink-0">
                        <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs text-[#1D9E75] font-semibold">Выбран</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-[#f0faf6] border border-[#1D9E75]/20 rounded-2xl p-4 flex items-center gap-3">
                <span className="text-2xl">♻️</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    Тариф «{selectedPlan.name}» · {selectedPlan.price.toLocaleString("ru")} ₽/мес
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Вывоз мусора будет приезжать по этому адресу еженедельно
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Полный адрес <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => { setAddress(e.target.value); setErrors(v => ({ ...v, address: "" })); }}
                  placeholder="Московская область, д. Барвиха, ул. Лесная, 12"
                  className={[
                    "w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] transition-all",
                    errors.address ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:bg-white",
                  ].join(" ")}
                />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Населённый пункт <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={e => { setCity(e.target.value); setErrors(v => ({ ...v, city: "" })); }}
                  placeholder="Барвиха"
                  className={[
                    "w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] transition-all",
                    errors.city ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:bg-white",
                  ].join(" ")}
                />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Ориентир / комментарий <span className="text-gray-400 font-normal">(необязательно)</span>
                </label>
                <textarea
                  value={landmark}
                  onChange={e => setLandmark(e.target.value)}
                  placeholder="Код ворот, цвет забора, собака во дворе..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D9E75] resize-none transition-all"
                />
              </div>

              <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <svg className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Этот адрес станет вашим основным и будет автоматически использоваться при заказе любых услуг. Мы работаем в радиусе 80 км от МКАД.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100">
          <button
            onClick={handleNext}
            disabled={loading}
            className="w-full h-13 min-h-[52px] bg-[#1D9E75] hover:bg-[#1D9E75]/90 active:scale-[0.99] text-white font-semibold rounded-xl transition-all duration-150 flex items-center justify-center gap-2 text-base disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Оформляем...
              </>
            ) : step === 1 ? "Далее — указать адрес" : "Подключить подписку"}
          </button>
        </div>
      </div>
    </div>
  );
}
