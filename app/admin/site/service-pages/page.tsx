"use client";

import { useState, useEffect, useCallback } from "react";
import {
  SERVICE_PAGE_DATA,
  type ServicePageData,
  type ProblemCard,
  type HowItWorksStep,
  type IncludedFeature,
  type ComparisonRow,
  type ForWhomCard,
  type FaqItem,
  type ServiceStat,
} from "@/constants/service-pages";

// ─── Utility UI ───────────────────────────────────────────────────────────────

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
        {hint && <span className="font-normal normal-case text-gray-400 ml-1">({hint})</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75]";
const textareaCls = inputCls + " resize-none";

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      className={inputCls}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function Textarea({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      className={textareaCls}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function Section({
  title,
  children,
  defaultOpen,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="font-semibold text-sm text-gray-800">{title}</span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="p-5 space-y-5 bg-white">{children}</div>}
    </div>
  );
}

function Toast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#1D9E75] text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      Сохранено!
    </div>
  );
}

// ─── Sub-editors ──────────────────────────────────────────────────────────────

function StatsEditor({
  stats,
  onChange,
}: {
  stats: ServiceStat[];
  onChange: (stats: ServiceStat[]) => void;
}) {
  const update = (i: number, key: keyof ServiceStat, val: string) => {
    const next = stats.map((s, idx) => (idx === i ? { ...s, [key]: val } : s));
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {stats.map((s, i) => (
        <div key={i} className="grid grid-cols-2 gap-3">
          <Input value={s.value} onChange={(v) => update(i, "value", v)} placeholder="500+" />
          <Input value={s.label} onChange={(v) => update(i, "label", v)} placeholder="домов" />
        </div>
      ))}
    </div>
  );
}

function ProblemCardsEditor({
  cards,
  onChange,
}: {
  cards: ProblemCard[];
  onChange: (cards: ProblemCard[]) => void;
}) {
  const update = (i: number, key: keyof ProblemCard, val: string) => {
    const next = cards.map((c, idx) => (idx === i ? { ...c, [key]: val } : c));
    onChange(next);
  };
  return (
    <div className="space-y-4">
      {cards.map((c, i) => (
        <div key={i} className="rounded-lg border border-gray-100 p-4 space-y-3">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Карточка {i + 1}</div>
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <Input value={c.icon} onChange={(v) => update(i, "icon", v)} placeholder="🛍" />
            <Input value={c.title} onChange={(v) => update(i, "title", v)} placeholder="Заголовок" />
          </div>
          <Textarea rows={2} value={c.description} onChange={(v) => update(i, "description", v)} placeholder="Описание" />
        </div>
      ))}
    </div>
  );
}

function StepsEditor({
  steps,
  onChange,
}: {
  steps: HowItWorksStep[];
  onChange: (steps: HowItWorksStep[]) => void;
}) {
  const update = (i: number, key: keyof HowItWorksStep, val: string) => {
    const next = steps.map((s, idx) => (idx === i ? { ...s, [key]: val } : s));
    onChange(next);
  };
  return (
    <div className="space-y-4">
      {steps.map((s, i) => (
        <div key={i} className="rounded-lg border border-gray-100 p-4 space-y-3">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Шаг {i + 1}</div>
          <Input value={s.title} onChange={(v) => update(i, "title", v)} placeholder="Название шага" />
          <Textarea rows={2} value={s.description} onChange={(v) => update(i, "description", v)} placeholder="Описание" />
        </div>
      ))}
    </div>
  );
}

function FeaturesEditor({
  features,
  onChange,
}: {
  features: IncludedFeature[];
  onChange: (features: IncludedFeature[]) => void;
}) {
  const text = features.map((f) => f.text).join("\n");
  const handleChange = (val: string) => {
    const lines = val.split("\n").map((l) => ({ text: l }));
    onChange(lines);
  };
  return (
    <Textarea
      rows={8}
      value={text}
      onChange={handleChange}
      placeholder={"Пункт 1\nПункт 2\nПункт 3"}
    />
  );
}

function ComparisonEditor({
  rows,
  onChange,
}: {
  rows: ComparisonRow[];
  onChange: (rows: ComparisonRow[]) => void;
}) {
  const update = (i: number, key: keyof ComparisonRow, val: string) => {
    const next = rows.map((r, idx) => (idx === i ? { ...r, [key]: val } : r));
    onChange(next);
  };
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
        <span>Параметр</span>
        <span>Без Домас</span>
        <span>С Домас</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-3 gap-2">
          <Input value={r.label} onChange={(v) => update(i, "label", v)} placeholder="Параметр" />
          <Input value={r.without} onChange={(v) => update(i, "without", v)} placeholder="Без нас" />
          <Input value={r.withDomas} onChange={(v) => update(i, "withDomas", v)} placeholder="С нами" />
        </div>
      ))}
    </div>
  );
}

function ForWhomEditor({
  cards,
  onChange,
}: {
  cards: ForWhomCard[];
  onChange: (cards: ForWhomCard[]) => void;
}) {
  const update = (i: number, key: keyof ForWhomCard, val: string) => {
    const next = cards.map((c, idx) => (idx === i ? { ...c, [key]: val } : c));
    onChange(next);
  };
  return (
    <div className="space-y-4">
      {cards.map((c, i) => (
        <div key={i} className="rounded-lg border border-gray-100 p-4 space-y-3">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Карточка {i + 1}</div>
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <Input value={c.icon} onChange={(v) => update(i, "icon", v)} placeholder="🏡" />
            <Input value={c.title} onChange={(v) => update(i, "title", v)} placeholder="Заголовок" />
          </div>
          <Textarea rows={2} value={c.description} onChange={(v) => update(i, "description", v)} placeholder="Описание" />
        </div>
      ))}
    </div>
  );
}

function FaqEditor({
  items,
  onChange,
}: {
  items: FaqItem[];
  onChange: (items: FaqItem[]) => void;
}) {
  const update = (i: number, key: keyof FaqItem, val: string) => {
    const next = items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it));
    onChange(next);
  };
  const add = () => onChange([...items, { q: "", a: "" }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="rounded-lg border border-gray-100 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Вопрос {i + 1}</div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              Удалить
            </button>
          </div>
          <Input value={it.q} onChange={(v) => update(i, "q", v)} placeholder="Вопрос?" />
          <Textarea rows={2} value={it.a} onChange={(v) => update(i, "a", v)} placeholder="Ответ..." />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
      >
        + Добавить вопрос
      </button>
    </div>
  );
}

// ─── Service editor panel ─────────────────────────────────────────────────────

function ServiceEditor({
  data,
  onChange,
}: {
  data: ServicePageData;
  onChange: (data: ServicePageData) => void;
}) {
  const set = <K extends keyof ServicePageData>(key: K, value: ServicePageData[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-3">
      {/* Hero */}
      <Section title="1. Заголовок (Hero)" defaultOpen>
        <Field label="Бейдж" hint="маленький тег над заголовком">
          <Input value={data.badge} onChange={(v) => set("badge", v)} placeholder="Основная подписка" />
        </Field>
        <Field label="Заголовок H1">
          <Textarea rows={2} value={data.h1} onChange={(v) => set("h1", v)} placeholder="Вывоз мусора — ..." />
        </Field>
        <Field label="Подзаголовок">
          <Textarea rows={3} value={data.subtitle} onChange={(v) => set("subtitle", v)} />
        </Field>
        <Field label="Статистика" hint="3 числа под кнопками">
          <StatsEditor stats={data.stats} onChange={(v) => set("stats", v)} />
        </Field>
      </Section>

      {/* Problem */}
      <Section title="2. Проблема">
        <Field label="Заголовок секции">
          <Input value={data.problemHeading} onChange={(v) => set("problemHeading", v)} />
        </Field>
        <Field label="4 карточки проблем">
          <ProblemCardsEditor cards={data.problemCards} onChange={(v) => set("problemCards", v)} />
        </Field>
        <Field label="Финальная карточка" hint="тёмная полная ширина, «С Домас...»">
          <Textarea rows={3} value={data.problemLastCard} onChange={(v) => set("problemLastCard", v)} />
        </Field>
      </Section>

      {/* How it works */}
      <Section title="3. Как это работает">
        <Field label="4 шага">
          <StepsEditor steps={data.howItWorksSteps} onChange={(v) => set("howItWorksSteps", v)} />
        </Field>
        <Field label="Пометка под шагами">
          <Textarea rows={2} value={data.howItWorksNote} onChange={(v) => set("howItWorksNote", v)} />
        </Field>
      </Section>

      {/* Included */}
      <Section title="4. Что входит + Цена">
        <Field label="Заголовок секции" hint="необязательно">
          <Input
            value={data.includedHeading ?? ""}
            onChange={(v) => set("includedHeading", v || undefined)}
            placeholder="Полный пакет — всё включено"
          />
        </Field>
        <Field label="Список включённого" hint="каждый пункт с новой строки">
          <FeaturesEditor features={data.includedFeatures} onChange={(v) => set("includedFeatures", v)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Цена">
            <Input value={data.price} onChange={(v) => set("price", v)} placeholder="от 1 490 ₽" />
          </Field>
          <Field label="Подпись под ценой">
            <Input value={data.priceNote} onChange={(v) => set("priceNote", v)} placeholder="в месяц" />
          </Field>
        </div>
      </Section>

      {/* Comparison */}
      <Section title="5. Сравнение">
        <ComparisonEditor rows={data.comparisonRows} onChange={(v) => set("comparisonRows", v)} />
      </Section>

      {/* For whom */}
      <Section title="6. Для кого">
        <ForWhomEditor cards={data.forWhom} onChange={(v) => set("forWhom", v)} />
      </Section>

      {/* FAQ */}
      <Section title="7. Вопросы и ответы">
        <FaqEditor items={data.faq} onChange={(v) => set("faq", v)} />
      </Section>

      {/* Final CTA */}
      <Section title="8. Финальный призыв (CTA)">
        <Field label="Заголовок">
          <Textarea rows={2} value={data.finalCtaHeading} onChange={(v) => set("finalCtaHeading", v)} />
        </Field>
        <Field label="Подзаголовок">
          <Textarea rows={2} value={data.finalCtaSubtitle} onChange={(v) => set("finalCtaSubtitle", v)} />
        </Field>
      </Section>
    </div>
  );
}

// ─── Service tab bar ──────────────────────────────────────────────────────────

const SERVICE_LIST = [
  { id: "waste_removal",      label: "Вывоз мусора" },
  { id: "lawn_care",          label: "Уход за участком" },
  { id: "septic_pumping",     label: "Откачка септика" },
  { id: "construction_waste", label: "Стр. отходы" },
  { id: "snow_removal",       label: "Уборка снега" },
  { id: "cleaning",           label: "Клининг" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ServicePagesAdmin() {
  const [activeId, setActiveId]       = useState(SERVICE_LIST[0].id);
  const [allData, setAllData]         = useState<Record<string, ServicePageData>>({});
  const [savedJson, setSavedJson]     = useState<Record<string, string>>({});
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [showToast, setShowToast]     = useState(false);

  // Load all service page settings from DB on mount
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((settings: Record<string, string>) => {
        const initialData: Record<string, ServicePageData> = {};
        const initialJson: Record<string, string> = {};

        for (const svc of SERVICE_LIST) {
          const raw = settings[`site.servicePage.${svc.id}`];
          let parsed: ServicePageData | null = null;
          if (raw) {
            try { parsed = JSON.parse(raw) as ServicePageData; } catch { /* ignore */ }
          }
          const data = parsed ?? SERVICE_PAGE_DATA[svc.id];
          initialData[svc.id] = data;
          initialJson[svc.id] = JSON.stringify(data);
        }

        setAllData(initialData);
        setSavedJson(initialJson);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateService = useCallback((id: string, data: ServicePageData) => {
    setAllData((prev) => ({ ...prev, [id]: data }));
  }, []);

  const isDirty = SERVICE_LIST.some(
    (svc) => JSON.stringify(allData[svc.id]) !== savedJson[svc.id]
  );

  const dirtyServices = SERVICE_LIST.filter(
    (svc) => JSON.stringify(allData[svc.id]) !== savedJson[svc.id]
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, string> = {};
      for (const svc of dirtyServices) {
        payload[`site.servicePage.${svc.id}`] = JSON.stringify(allData[svc.id]);
      }

      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? `Ошибка сохранения (${res.status})`);
        return;
      }

      // Update savedJson for all dirty services
      setSavedJson((prev) => {
        const next = { ...prev };
        for (const svc of dirtyServices) {
          next[svc.id] = JSON.stringify(allData[svc.id]);
        }
        return next;
      });

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!confirm("Сбросить изменения текущей услуги до сохранённого состояния?")) return;
    setAllData((prev) => ({
      ...prev,
      [activeId]: JSON.parse(savedJson[activeId]) as ServicePageData,
    }));
  };

  const handleResetToDefaults = () => {
    if (!confirm("Сбросить всё содержимое до исходных данных из кода? Все сохранённые изменения будут потеряны.")) return;
    setAllData((prev) => ({ ...prev, [activeId]: SERVICE_PAGE_DATA[activeId] }));
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const activeData = allData[activeId];
  const isActiveDirty = JSON.stringify(activeData) !== savedJson[activeId];

  return (
    <>
      <div className="p-6 lg:p-8 max-w-4xl pb-28 space-y-5">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
          <h2 className="font-raleway font-bold text-base text-gray-900">Страницы услуг</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Редактируйте весь контент каждой страницы. Изменения вступают в силу сразу после сохранения.
          </p>
        </div>

        {/* Service tabs */}
        <div className="flex flex-wrap gap-2">
          {SERVICE_LIST.map((svc) => {
            const dirty = JSON.stringify(allData[svc.id]) !== savedJson[svc.id];
            return (
              <button
                key={svc.id}
                type="button"
                onClick={() => setActiveId(svc.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${
                  activeId === svc.id
                    ? "bg-[#1D9E75] text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {svc.label}
                {dirty && (
                  <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${activeId === svc.id ? "bg-white" : "bg-amber-400"}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Active service info bar */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {isActiveDirty ? (
              <span className="text-amber-600 font-medium">Есть несохранённые изменения</span>
            ) : (
              <span>Изменений нет</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isActiveDirty && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Отменить изменения
              </button>
            )}
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Сбросить до исходных
            </button>
          </div>
        </div>

        {/* Editor */}
        {activeData && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <ServiceEditor
              key={activeId}
              data={activeData}
              onChange={(data) => updateService(activeId, data)}
            />
          </div>
        )}

        {/* Dirty services summary */}
        {dirtyServices.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-sm text-amber-700">
            Несохранённые изменения: {dirtyServices.map((s) => s.label).join(", ")}
          </div>
        )}
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="text-sm text-gray-400">
          {isDirty
            ? `Сохранить изменения в ${dirtyServices.length} ${dirtyServices.length === 1 ? "услуге" : "услугах"}`
            : "Все изменения сохранены"}
        </span>
        <button
          onClick={handleSave}
          disabled={saving || !isDirty}
          className="bg-[#1D9E75] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1D9E75]/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </div>

      <Toast show={showToast} />
    </>
  );
}
