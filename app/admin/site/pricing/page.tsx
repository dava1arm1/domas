"use client";

import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────
interface Plan {
  id: string;
  name: string;
  price: number;
  annualPrice: number;
  description: string;
  features: string[];
  popular: boolean;
}

const DEFAULT_PLANS: Plan[] = [
  {
    id: "BASIC",
    name: "Базовый",
    price: 1490,
    annualPrice: 14900,
    description: "Для небольшого участка",
    features: ["Вывоз мусора еженедельно", "Уведомления", "Личный кабинет"],
    popular: false,
  },
  {
    id: "COMFORT",
    name: "Комфорт",
    price: 3490,
    annualPrice: 34900,
    description: "Самый популярный выбор",
    features: ["Всё из Базового", "Откачка септика 2 раза/год", "Уход за участком"],
    popular: true,
  },
  {
    id: "MAX",
    name: "Максимум",
    price: 5990,
    annualPrice: 59900,
    description: "Полный пакет услуг",
    features: ["Всё из Комфорт", "Клининг", "Уборка снега", "Приоритетный выезд"],
    popular: false,
  },
];

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

// ─── Toggle ───────────────────────────────────────────────────
function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:ring-offset-1 ${
          value ? "bg-[#1D9E75]" : "bg-gray-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            value ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </label>
  );
}

// ─── Plan Card ────────────────────────────────────────────────
function PlanCard({
  plan,
  onChange,
  onSetPopular,
}: {
  plan: Plan;
  onChange: (updated: Plan) => void;
  onSetPopular: () => void;
}) {
  const updateFeature = (i: number, val: string) => {
    const updated = [...plan.features];
    updated[i] = val;
    onChange({ ...plan, features: updated });
  };

  const deleteFeature = (i: number) => {
    onChange({ ...plan, features: plan.features.filter((_, idx) => idx !== i) });
  };

  const addFeature = () => {
    onChange({ ...plan, features: [...plan.features, ""] });
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border-2 transition-colors ${
        plan.popular ? "border-[#1D9E75]" : "border-gray-100"
      } flex flex-col`}
    >
      {/* Header */}
      <div className={`px-5 py-4 border-b ${plan.popular ? "border-[#1D9E75]/20 bg-[#1D9E75]/5" : "border-gray-100"}`}>
        <div className="flex items-center justify-between mb-3">
          <input
            className="font-raleway font-bold text-lg text-gray-900 bg-transparent border-b border-dashed border-gray-200 focus:outline-none focus:border-[#1D9E75] w-full mr-2"
            value={plan.name}
            onChange={(e) => onChange({ ...plan, name: e.target.value })}
            placeholder="Название плана"
          />
          {plan.popular && (
            <span className="flex-shrink-0 text-[10px] font-bold bg-[#1D9E75] text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
              Популярный
            </span>
          )}
        </div>
        <Toggle
          value={plan.popular}
          onChange={() => onSetPopular()}
          label="Популярный"
        />
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-4 flex-1">
        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Описание</label>
          <input
            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75]"
            value={plan.description}
            onChange={(e) => onChange({ ...plan, description: e.target.value })}
            placeholder="Краткое описание плана"
          />
        </div>

        {/* Prices */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Цена / мес. (₽)
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                className="w-full pl-3 pr-7 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75]"
                value={plan.price}
                onChange={(e) => onChange({ ...plan, price: Number(e.target.value) })}
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₽</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Цена / год (₽)
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                className="w-full pl-3 pr-7 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75]"
                value={plan.annualPrice}
                onChange={(e) => onChange({ ...plan, annualPrice: Number(e.target.value) })}
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₽</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Включено в план
          </label>
          <div className="space-y-2">
            {plan.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#1D9E75] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <input
                  className="flex-1 px-2.5 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75]"
                  value={feature}
                  onChange={(e) => updateFeature(i, e.target.value)}
                  placeholder="Опция плана..."
                />
                <button
                  onClick={() => deleteFeature(i)}
                  className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={addFeature}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 border border-dashed border-gray-200 rounded-lg text-xs font-medium text-gray-400 hover:border-[#1D9E75]/40 hover:text-[#1D9E75] transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Добавить функцию
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function PricingPage() {
  const [plans, setPlans]     = useState<Plan[]>(DEFAULT_PLANS);
  const [savedJson, setSaved] = useState(JSON.stringify(DEFAULT_PLANS));
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [showToast, setShowToast] = useState(false);

  const isDirty = JSON.stringify(plans) !== savedJson;

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        if (data["site.pricing"]) {
          try {
            const parsed = JSON.parse(data["site.pricing"]);
            if (Array.isArray(parsed)) {
              setPlans(parsed);
              setSaved(data["site.pricing"]);
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

  const updatePlan = (index: number, updated: Plan) => {
    setPlans((prev) => prev.map((p, i) => (i === index ? updated : p)));
  };

  const setPopular = (index: number) => {
    setPlans((prev) =>
      prev.map((p, i) => ({ ...p, popular: i === index ? !p.popular : false }))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "site.pricing": JSON.stringify(plans) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? `Ошибка сохранения (${res.status}). Убедитесь что выполнен: npx prisma db push`);
        return;
      }
      setSaved(JSON.stringify(plans));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 space-y-4 animate-pulse">
              <div className="h-6 bg-gray-100 rounded w-1/2" />
              <div className="h-10 bg-gray-100 rounded" />
              <div className="h-10 bg-gray-100 rounded" />
              <div className="space-y-2">
                {[1, 2, 3].map((j) => <div key={j} className="h-8 bg-gray-50 rounded" />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 lg:p-8 space-y-6 pb-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onChange={(updated) => updatePlan(index, updated)}
              onSetPopular={() => setPopular(index)}
            />
          ))}
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
