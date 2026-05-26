"use client";

import React from "react";

interface Props {
  name: string;
  email: string;
  phone: string | null;
}

export function SettingsPageClient({ name, email, phone }: Props) {
  return (
    <main className="flex-1 min-h-0 flex flex-col overflow-hidden">

      {/* ═══════════ MOBILE ═══════════ */}
      <div
        className="lg:hidden flex-1 min-h-0 overflow-y-auto overscroll-contain"
        style={{
          paddingBottom: "calc(72px + env(safe-area-inset-bottom) + 1rem)",
          WebkitOverflowScrolling: "touch",
        } as React.CSSProperties}
      >
        <div className="px-4 pt-4 pb-2">
          <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.06]">

            {/* Личные данные */}
            <div className="p-5">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Личные данные</p>
              <div className="space-y-3">
                {[
                  { label: "Имя",     value: name },
                  { label: "Email",   value: email },
                  { label: "Телефон", value: phone ?? "Не указан" },
                ].map((row) => (
                  <div key={row.label}>
                    <p className="text-[11px] text-white/30 mb-1">{row.label}</p>
                    <div className="flex items-center justify-between py-2.5 px-3 bg-white/[0.04] border border-white/[0.06] rounded-xl">
                      <span className="text-white/80 text-sm">{row.value}</span>
                      <button className="text-brand-green-light text-xs font-semibold">Изменить</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Безопасность */}
            <div className="p-5">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Безопасность</p>
              <button className="text-sm font-semibold text-brand-green-light">Изменить пароль →</button>
            </div>

            {/* Удаление */}
            <div className="p-5">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Удаление аккаунта</p>
              <p className="text-white/30 text-xs mb-3 leading-snug">Это действие необратимо. Все данные будут удалены.</p>
              <button className="text-sm font-semibold text-red-400">Удалить аккаунт</button>
            </div>

          </div>
        </div>
      </div>

      {/* ═══════════ DESKTOP ═══════════ */}
      <div
        className="hidden lg:block flex-1 min-h-0 overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-8">
          <h1 className="font-raleway font-black text-2xl text-gray-900 mb-6">Настройки</h1>

          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            <div className="p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Личные данные</h2>
              <div className="space-y-4">
                {[
                  { label: "Имя",     value: name },
                  { label: "Email",   value: email },
                  { label: "Телефон", value: phone ?? "Не указан" },
                ].map((row) => (
                  <div key={row.label}>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                      {row.label}
                    </label>
                    <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-900 text-sm">{row.value}</span>
                      <button className="text-brand-green text-xs font-semibold hover:underline">Изменить</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Безопасность</h2>
              <button className="text-sm font-semibold text-brand-green hover:underline">Изменить пароль →</button>
            </div>

            <div className="p-6">
              <h2 className="font-semibold text-gray-900 mb-1">Удаление аккаунта</h2>
              <p className="text-gray-400 text-sm mb-4">Это действие необратимо. Все данные будут удалены.</p>
              <button className="text-sm font-semibold text-red-500 hover:underline">Удалить аккаунт</button>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
