"use client";

import { useState } from "react";
import { DomoCoinIcon } from "@/components/ui/DomoCoinIcon";
import { formatDate } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────
interface Referral {
  id: string;
  name: string;
  createdAt: Date;
  orders: { id: string }[];
}

interface Props {
  referralCode: string;
  referrals: Referral[];
  referralEarned: number;
}

// ─────────────────────────────────────────────────────────────────
// Copy button (client-only interaction)
// ─────────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9E75]
        ${copied
          ? "bg-brand-green text-white"
          : "bg-[#1D9E75] hover:bg-[#179467] text-white"
        }`}
    >
      {copied ? (
        <>
          <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Скопировано!
        </>
      ) : (
        <>
          <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Копировать
        </>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────
// Share button
// ─────────────────────────────────────────────────────────────────
function ShareButton({ url, code }: { url: string; code: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Domas — обслуживание вашего дома",
          text: `Используйте мой промокод ${code} при регистрации и получите бонус!`,
          url,
        });
      } catch {
        // User cancelled share — do nothing
      }
    } else {
      // Fallback: open WhatsApp share
      const text = encodeURIComponent(
        `Попробуй Domas — сервис обслуживания домов. Регистрируйся по моей ссылке и получи бонус: ${url}`
      );
      window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9E75]"
    >
      <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      Поделиться
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────
// How-it-works step card
// ─────────────────────────────────────────────────────────────────
function HowItWorksStep({
  step,
  icon,
  title,
  subtitle,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center text-center px-3">
      {/* Step number + icon */}
      <div className="relative mb-3">
        <div className="h-14 w-14 rounded-2xl bg-[#1D9E75]/10 border border-[#1D9E75]/20 flex items-center justify-center">
          {icon}
        </div>
        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-[#1D9E75] text-white text-[10px] font-black flex items-center justify-center">
          {step}
        </span>
      </div>
      <p className="font-raleway font-bold text-gray-800 text-sm leading-snug mb-0.5">{title}</p>
      <p className="text-xs text-gray-500 leading-snug">{subtitle}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main client component
// ─────────────────────────────────────────────────────────────────
export function ReferralPageClient({ referralCode, referrals, referralEarned }: Props) {
  const referralUrl = `https://domas.ru/ref/${referralCode}`;
  const completedReferrals = referrals.filter((r) => r.orders.length > 0).length;

  return (
    <main className="flex-1 overflow-y-auto overscroll-contain">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5" style={{ paddingBottom: "calc(72px + env(safe-area-inset-bottom) + 2rem)" }}>

        {/* ── PAGE TITLE ── */}
        <div className="flex items-center justify-between">
          <h1 className="font-raleway font-black text-2xl text-gray-900">
            Реферальная программа
          </h1>
          {/* Total earned badge */}
          {referralEarned > 0 && (
            <div className="flex items-center gap-1.5 bg-brand-green-pale border border-brand-green/20 rounded-full px-3 py-1">
              <DomoCoinIcon size={16} />
              <span className="text-brand-green text-sm font-bold tabular-nums">
                +{referralEarned.toLocaleString("ru-RU")}
              </span>
            </div>
          )}
        </div>

        {/* ── REFERRAL LINK CARD ── */}
        <div className="bg-brand-dark rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 pt-6 pb-2">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">
              Ваша реферальная ссылка
            </p>
            <p className="font-raleway font-black text-white text-lg mb-5">
              Делитесь и получайте{" "}
              <span className="text-brand-green-light">1 000 монет</span> за каждого друга
            </p>

            {/* Link display */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 mb-4">
              <p className="font-mono text-[#5DCAA5] text-sm break-all leading-relaxed select-all">
                {referralUrl}
              </p>
            </div>

            {/* Referral code chip */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-white/40 text-xs">Ваш код:</span>
              <span className="font-mono font-bold text-sm bg-white/10 text-white px-3 py-1 rounded-lg tracking-widest">
                {referralCode || "—"}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2.5 pb-6">
              <CopyButton text={referralUrl} />
              <ShareButton url={referralUrl} code={referralCode} />
            </div>
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
          <h2 className="font-raleway font-bold text-base text-gray-700 mb-5 text-center uppercase tracking-wider text-xs">
            Как это работает
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <HowItWorksStep
              step={1}
              title="Поделитесь ссылкой"
              subtitle="Отправьте другу"
              icon={
                <svg className="h-6 w-6 text-[#1D9E75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              }
            />
            <HowItWorksStep
              step={2}
              title="Друг регистрируется"
              subtitle="По вашей ссылке"
              icon={
                <svg className="h-6 w-6 text-[#1D9E75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              }
            />
            <HowItWorksStep
              step={3}
              title="+1 000 монет"
              subtitle="После первого выполненного заказа"
              icon={<DomoCoinIcon size={28} />}
            />
          </div>
        </div>

        {/* ── REFERRALS TABLE ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-raleway font-bold text-gray-900 text-base">
              Мои рефералы
            </h2>
            {referrals.length > 0 && (
              <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
                {referrals.length}
              </span>
            )}
          </div>

          {referrals.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <div className="h-12 w-12 mx-auto mb-3 rounded-2xl bg-gray-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="font-semibold text-gray-600 mb-1">Пока никого нет</p>
              <p className="text-gray-400 text-sm">
                Пока никто не зарегистрировался по вашей ссылке
              </p>
            </div>
          ) : (
            <>
              {/* Table header — desktop only */}
              <div className="hidden sm:grid grid-cols-4 gap-4 px-5 py-2.5 bg-gray-50/70 border-b border-gray-100">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Имя</p>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Дата регистрации</p>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Первый заказ</p>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide text-right">Бонус</p>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-50">
                {referrals.map((ref) => {
                  const hasOrder = ref.orders.length > 0;
                  return (
                    <div key={ref.id} className="px-5 py-3.5">
                      {/* Mobile layout */}
                      <div className="sm:hidden">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-800 text-sm">{ref.name}</p>
                          {hasOrder ? (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-brand-green bg-brand-green-pale border border-brand-green/20 px-2 py-0.5 rounded-full">
                              <DomoCoinIcon size={12} />
                              +1 000
                            </span>
                          ) : (
                            <span className="text-[11px] text-gray-400 font-medium">—</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span>{formatDate(ref.createdAt)}</span>
                          <span
                            className={`font-semibold ${hasOrder ? "text-emerald-600" : "text-gray-400"}`}
                          >
                            {hasOrder ? "✓ Выполнен" : "Ожидается"}
                          </span>
                        </div>
                      </div>

                      {/* Desktop layout */}
                      <div className="hidden sm:grid grid-cols-4 gap-4 items-center">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75] text-xs font-bold flex-shrink-0">
                            {ref.name.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-medium text-gray-800 text-sm truncate">{ref.name}</p>
                        </div>
                        <p className="text-sm text-gray-500">{formatDate(ref.createdAt)}</p>
                        <p className={`text-sm font-semibold ${hasOrder ? "text-emerald-600" : "text-gray-400"}`}>
                          {hasOrder ? "✓ Выполнен" : "Ожидается"}
                        </p>
                        <div className="flex justify-end">
                          {hasOrder ? (
                            <span className="flex items-center gap-1 text-xs font-bold text-brand-green bg-brand-green-pale border border-brand-green/20 px-2.5 py-1 rounded-full">
                              <DomoCoinIcon size={12} />
                              +1 000 монет
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400 font-medium">—</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary footer */}
              {completedReferrals > 0 && (
                <div className="px-5 py-4 bg-brand-green-pale border-t border-brand-green/20 flex items-center justify-between">
                  <p className="text-sm text-brand-green font-medium">
                    Итого заработано за рефералов:
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="font-raleway font-black text-brand-green text-base tabular-nums">
                      +{referralEarned.toLocaleString("ru-RU")}
                    </span>
                    <DomoCoinIcon size={18} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom tip */}
        <p className="text-center text-xs text-gray-400 pb-2">
          Монеты зачисляются автоматически после выполнения первого заказа вашим другом
        </p>

      </div>
    </main>
  );
}
