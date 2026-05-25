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
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        <h1 className="font-raleway font-black text-2xl text-gray-900">ДомоКоины</h1>

        {/* ── Баланс ── */}
        <div className="bg-brand-dark rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-7">
            <div className="flex items-center gap-5">
              <DomoCoinIcon size={52} />
              <div>
                <div className="flex items-end gap-2">
                  <span className="font-raleway font-black text-5xl text-white leading-none tabular-nums">
                    {balance.toLocaleString("ru-RU")}
                  </span>
                </div>
                <p className="text-white/50 text-sm font-medium mt-1">ДомоКоинов</p>
                <p className="text-white/30 text-xs mt-0.5">= {balance.toLocaleString("ru-RU")} ₽ скидки</p>
              </div>
            </div>
          </div>

          {expiringAmount > 0 && (
            <div className="mx-4 mb-4 bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-2.5 flex items-center gap-2.5">
              <svg className="h-4 w-4 text-white/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-white/60 text-sm">
                <span className="font-semibold text-white">{expiringAmount.toLocaleString("ru-RU")} монет</span> сгорят в течение 30 дней
              </p>
            </div>
          )}
        </div>

        {/* ── Статистика ── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 px-4 py-3.5 shadow-sm">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Заработано</p>
            <div className="flex items-center gap-1.5">
              <span className="font-raleway font-black text-lg text-brand-green tabular-nums leading-none">
                {totalEarned.toLocaleString("ru-RU")}
              </span>
              <DomoCoinIcon size={14} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 px-4 py-3.5 shadow-sm">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Потрачено</p>
            <div className="flex items-center gap-1.5">
              <span className="font-raleway font-black text-lg text-gray-500 tabular-nums leading-none">
                {totalSpent.toLocaleString("ru-RU")}
              </span>
              <DomoCoinIcon size={14} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 px-4 py-3.5 shadow-sm">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Сгорело</p>
            <div className="flex items-center gap-1.5">
              <span className="font-raleway font-black text-lg text-red-400 tabular-nums leading-none">
                {totalExpired.toLocaleString("ru-RU")}
              </span>
              <DomoCoinIcon size={14} />
            </div>
          </div>
        </div>

        {/* ── Фильтр ── */}
        <div className="flex gap-2 bg-gray-100/80 p-1 rounded-xl">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-150
                ${tab === key
                  ? "bg-brand-green text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/60"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── История транзакций ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-14 px-6 text-center">
              <div className="h-14 w-14 mx-auto mb-3 rounded-2xl bg-brand-green-pale flex items-center justify-center">
                <DomoCoinIcon size={32} />
              </div>
              <p className="font-semibold text-gray-600 mb-1">
                {tab === "all" ? "Монет пока нет" : tab === "earned" ? "Начислений нет" : "Списаний нет"}
              </p>
              <p className="text-gray-400 text-sm">
                {tab === "all" ? "Оформите первый заказ!" : "История появится здесь"}
              </p>
            </div>
          ) : (
            filtered.map((tx) => <TransactionRow key={tx.id} tx={tx} />)
          )}
        </div>

        <p className="text-center text-xs text-gray-400 pb-2">
          1 ДомоКоин = 1 ₽ скидки · До 30% от суммы заказа
        </p>

      </div>
    </main>
  );
}
