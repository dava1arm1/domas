"use client";

import { useState } from "react";
import { DomoCoinIcon } from "@/components/ui/DomoCoinIcon";
import { formatDate } from "@/lib/utils";

type CoinTransactionType =
  | "EARNED_ORDER"
  | "EARNED_REVIEW"
  | "EARNED_REFERRAL"
  | "EARNED_WELCOME"
  | "SPENT_DISCOUNT"
  | "EXPIRED";

interface CoinTransaction {
  id: string;
  amount: number;
  type: CoinTransactionType;
  description: string;
  expiresAt: Date | null;
  createdAt: Date;
}

interface Props {
  balance: number;
  transactions: CoinTransaction[];
  totalEarned: number;
  totalSpent: number;
  totalExpired: number;
  expiringAmount: number;
}

type FilterTab = "all" | "earned" | "spent";

const TYPE_LABELS: Record<CoinTransactionType, string> = {
  EARNED_ORDER:    "Заказ",
  EARNED_REVIEW:   "Отзыв",
  EARNED_REFERRAL: "Реферал",
  EARNED_WELCOME:  "Первый заказ",
  SPENT_DISCOUNT:  "Списание",
  EXPIRED:         "Истёк срок",
};

const TYPE_BADGE: Record<CoinTransactionType, string> = {
  EARNED_ORDER:    "bg-brand-green-pale text-brand-green border border-brand-green/20",
  EARNED_REVIEW:   "bg-brand-green-pale text-brand-green border border-brand-green/20",
  EARNED_REFERRAL: "bg-brand-green-pale text-brand-green border border-brand-green/20",
  EARNED_WELCOME:  "bg-brand-green-pale text-brand-green border border-brand-green/20",
  SPENT_DISCOUNT:  "bg-gray-100 text-gray-500 border border-gray-200",
  EXPIRED:         "bg-red-50 text-red-500 border border-red-100",
};

function isEarned(t: CoinTransaction) { return t.amount > 0; }
function isSpent(t: CoinTransaction)  { return t.type === "SPENT_DISCOUNT" || t.type === "EXPIRED"; }

function TransactionRow({ tx }: { tx: CoinTransaction }) {
  const earned  = isEarned(tx);
  const expired = tx.type === "EXPIRED";

  return (
    <div className="flex items-center gap-3.5 px-5 py-4 hover:bg-gray-50/70 transition-colors border-b border-gray-50 last:border-0">
      {/* Sign indicator */}
      <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold
        ${earned ? "bg-brand-green-pale text-brand-green" : expired ? "bg-gray-100 text-gray-400" : "bg-red-50 text-red-500"}`}
      >
        {earned ? "+" : "−"}
      </div>

      {/* Description + badge */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 leading-snug truncate">{tx.description}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full ${TYPE_BADGE[tx.type]}`}>
            {TYPE_LABELS[tx.type]}
          </span>
          <span className="text-[11px] text-gray-400">{formatDate(tx.createdAt)}</span>
        </div>
        {tx.expiresAt && isEarned(tx) && (
          <p className="text-[11px] text-gray-400 mt-0.5">
            Сгорит: {formatDate(tx.expiresAt)}
          </p>
        )}
      </div>

      {/* Amount */}
      <div className={`flex items-center gap-1 flex-shrink-0 font-bold text-sm tabular-nums
        ${earned ? "text-brand-green" : expired ? "text-gray-400" : "text-red-500"}`}
      >
        <span>{earned ? "+" : "−"}</span>
        <span>{Math.abs(tx.amount)}</span>
        <DomoCoinIcon size={14} className="flex-shrink-0" />
      </div>
    </div>
  );
}

export function CoinsPageClient({
  balance,
  transactions,
  totalEarned,
  totalSpent,
  totalExpired,
  expiringAmount,
}: Props) {
  const [tab, setTab] = useState<FilterTab>("all");

  const filtered = transactions.filter((t) => {
    if (tab === "earned") return isEarned(t);
    if (tab === "spent")  return isSpent(t);
    return true;
  });

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all",    label: "Все" },
    { key: "earned", label: "Начисления" },
    { key: "spent",  label: "Списания" },
  ];

  return (
    <main className="flex-1 min-h-0 flex flex-col overflow-hidden">

      {/* ═══════════ MOBILE LAYOUT — статичная шапка + внутренняя прокрутка ═══════════ */}
      <div className="lg:hidden flex-1 min-h-0 flex flex-col overflow-hidden">

        {/* Баланс */}
        <div className="flex-shrink-0 px-4 pt-4 pb-3">
          <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 flex items-center gap-4">
              <DomoCoinIcon size={42} />
              <div className="flex-1 min-w-0">
                <span className="font-raleway font-black text-4xl text-white leading-none tabular-nums">
                  {balance.toLocaleString("ru-RU")}
                </span>
                <p className="text-white/40 text-xs mt-0.5">= {balance.toLocaleString("ru-RU")} ₽ скидки</p>
              </div>
            </div>
            {expiringAmount > 0 && (
              <div className="mx-4 mb-3 bg-[#F5C518]/[0.08] border border-[#F5C518]/[0.15] rounded-xl px-3 py-2 flex items-center gap-2">
                <svg className="h-3.5 w-3.5 text-[#F5C518]/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-white/50 text-xs"><span className="font-semibold text-white/80">{expiringAmount.toLocaleString("ru-RU")} монет</span> сгорят через 30 дней</p>
              </div>
            )}
          </div>
        </div>

        {/* Статистика */}
        <div className="flex-shrink-0 px-4 pb-3 grid grid-cols-3 gap-2">
          {[
            { label: "Заработано", value: totalEarned, color: "text-brand-green-light" },
            { label: "Потрачено",  value: totalSpent,   color: "text-white/50" },
            { label: "Сгорело",    value: totalExpired, color: "text-red-400" },
          ].map((s) => (
            <div key={s.label} className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5">
              <p className="text-[9px] font-bold text-white/30 uppercase tracking-wide mb-1">{s.label}</p>
              <div className="flex items-center gap-1">
                <span className={`font-raleway font-black text-base tabular-nums leading-none ${s.color}`}>{s.value.toLocaleString("ru-RU")}</span>
                <DomoCoinIcon size={12} />
              </div>
            </div>
          ))}
        </div>

        {/* Фильтр */}
        <div className="flex-shrink-0 px-4 pb-3">
          <div className="flex gap-1 bg-white/[0.05] p-1 rounded-xl">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all touch-manipulation ${
                  tab === key ? "bg-brand-green text-white" : "text-white/30"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* История — только эта часть скроллится */}
        <div
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4"
          style={{ paddingBottom: "calc(72px + env(safe-area-inset-bottom))", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="h-12 w-12 mx-auto mb-3 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                <DomoCoinIcon size={28} />
              </div>
              <p className="font-semibold text-white/50 mb-1">
                {tab === "all" ? "Монет пока нет" : tab === "earned" ? "Начислений нет" : "Списаний нет"}
              </p>
              <p className="text-white/30 text-sm">
                {tab === "all" ? "Оформите первый заказ!" : "История появится здесь"}
              </p>
            </div>
          ) : (
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden">
              {filtered.map((tx) => {
                const earned  = isEarned(tx);
                const expired = tx.type === "EXPIRED";
                return (
                  <div key={tx.id} className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.05] last:border-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${earned ? "bg-brand-green/20 text-brand-green-light" : expired ? "bg-white/[0.06] text-white/30" : "bg-red-500/10 text-red-400"}`}>
                      {earned ? "+" : "−"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white/80 truncate">{tx.description}</p>
                      <p className="text-[11px] text-white/30 mt-0.5">{formatDate(tx.createdAt)}</p>
                    </div>
                    <div className={`flex items-center gap-1 flex-shrink-0 font-bold text-sm tabular-nums ${earned ? "text-brand-green-light" : expired ? "text-white/30" : "text-red-400"}`}>
                      <span>{earned ? "+" : "−"}</span>
                      <span>{Math.abs(tx.amount)}</span>
                      <DomoCoinIcon size={12} className="flex-shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <p className="text-center text-xs text-white/20 py-4">1 ДомоКоин = 1 ₽ скидки · До 30% от суммы заказа</p>
        </div>
      </div>

      {/* ═══════════ DESKTOP LAYOUT ═══════════ */}
      <div className="hidden lg:block flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">

          <h1 className="font-raleway font-black text-2xl text-gray-900">ДомоКоины</h1>

          <div className="bg-brand-dark rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-7">
              <div className="flex items-center gap-5">
                <DomoCoinIcon size={52} />
                <div>
                  <span className="font-raleway font-black text-5xl text-white leading-none tabular-nums">{balance.toLocaleString("ru-RU")}</span>
                  <p className="text-white/50 text-sm font-medium mt-1">ДомоКоинов</p>
                  <p className="text-white/30 text-xs mt-0.5">= {balance.toLocaleString("ru-RU")} ₽ скидки</p>
                </div>
              </div>
            </div>
            {expiringAmount > 0 && (
              <div className="mx-4 mb-4 bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-2.5 flex items-center gap-2.5">
                <svg className="h-4 w-4 text-white/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-white/60 text-sm"><span className="font-semibold text-white">{expiringAmount.toLocaleString("ru-RU")} монет</span> сгорят в течение 30 дней</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Заработано", value: totalEarned, cls: "text-brand-green" },
              { label: "Потрачено",  value: totalSpent,  cls: "text-gray-500" },
              { label: "Сгорело",    value: totalExpired,cls: "text-red-400" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3.5 shadow-sm">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">{s.label}</p>
                <div className="flex items-center gap-1.5"><span className={`font-raleway font-black text-lg tabular-nums leading-none ${s.cls}`}>{s.value.toLocaleString("ru-RU")}</span><DomoCoinIcon size={14} /></div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 bg-gray-100/80 p-1 rounded-xl">
            {tabs.map(({ key, label }) => (
              <button key={key} onClick={() => setTab(key)} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-150 ${tab === key ? "bg-brand-green text-white shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-white/60"}`}>{label}</button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <div className="py-14 px-6 text-center">
                <div className="h-14 w-14 mx-auto mb-3 rounded-2xl bg-brand-green-pale flex items-center justify-center"><DomoCoinIcon size={32} /></div>
                <p className="font-semibold text-gray-600 mb-1">{tab === "all" ? "Монет пока нет" : tab === "earned" ? "Начислений нет" : "Списаний нет"}</p>
                <p className="text-gray-400 text-sm">{tab === "all" ? "Оформите первый заказ!" : "История появится здесь"}</p>
              </div>
            ) : (
              filtered.map((tx) => <TransactionRow key={tx.id} tx={tx} />)
            )}
          </div>

          <p className="text-center text-xs text-gray-400 pb-2">1 ДомоКоин = 1 ₽ скидки · До 30% от суммы заказа</p>
        </div>
      </div>

    </main>
  );
}
