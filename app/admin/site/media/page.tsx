"use client";

import Link from "next/link";

// ─── Placeholder media items ──────────────────────────────────
const MEDIA_ITEMS = [
  { label: "hero.mp4",        hint: "текущее видео",     icon: "video",  size: "— МБ" },
  { label: "Иконка услуги 1", hint: "Вывоз мусора",      icon: "image",  size: "— КБ" },
  { label: "Иконка услуги 2", hint: "Клининг",           icon: "image",  size: "— КБ" },
  { label: "Иконка услуги 3", hint: "Уход за участком",  icon: "image",  size: "— КБ" },
  { label: "og-image.jpg",    hint: "OG-картинка",       icon: "image",  size: "— КБ" },
  { label: "logo.svg",        hint: "Логотип сайта",     icon: "image",  size: "— КБ" },
];

// ─── SVG icons ────────────────────────────────────────────────
function VideoIcon() {
  return (
    <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function StorageIcon() {
  return (
    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function MediaPage() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">

      {/* ── Main card ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-raleway font-bold text-base text-gray-900">Медиа и фото</h2>
            <p className="text-xs text-gray-400 mt-0.5">Управление файлами сайта</p>
          </div>
          <Link
            href="/admin/system"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <StorageIcon />
            Настроить хранилище
          </Link>
        </div>

        {/* Status banner */}
        <div className="mx-6 mt-5 mb-2 flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3.5">
          <svg className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-800">Загрузка файлов недоступна</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Загрузка файлов будет доступна после настройки хранилища (AWS S3 или Supabase Storage).
              Перейдите в{" "}
              <Link href="/admin/system" className="underline font-medium">
                Настройки системы
              </Link>{" "}
              для настройки API-ключей.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="px-6 py-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Текущие файлы
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MEDIA_ITEMS.map((item) => (
              <div
                key={item.label}
                className="group border border-gray-100 rounded-xl overflow-hidden bg-gray-50 hover:border-gray-200 transition-colors"
              >
                {/* Thumbnail area */}
                <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                  {item.icon === "video" ? <VideoIcon /> : <ImageIcon />}
                </div>

                {/* Info */}
                <div className="px-3 py-2.5 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-700 truncate" title={item.label}>
                    {item.label}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">{item.hint}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-gray-300">{item.size}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-400 font-medium uppercase">
                      {item.icon === "video" ? "MP4" : "IMG"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Manual video upload instruction ───────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-raleway font-bold text-base text-gray-900">Видео на главной странице</h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-4">
            <FolderIcon />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-800">Ручная замена видео</p>
              <p className="text-sm text-gray-600">
                Для замены видео на главной странице, загрузите файл в папку вашего проекта вручную:
              </p>
              <code className="block bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-700 mt-2">
                /public/video/hero.mp4
              </code>
              <p className="text-xs text-gray-400 mt-1.5">
                Рекомендуемый формат: MP4 (H.264), разрешение 1920×1080, размер до 30 МБ.
                После загрузки файла выполните деплой приложения.
              </p>
            </div>
          </div>

          {/* Toggle hint */}
          <div className="flex items-center gap-3 bg-[#1D9E75]/5 border border-[#1D9E75]/15 rounded-xl px-4 py-3">
            <svg className="h-5 w-5 text-[#1D9E75] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-gray-600">
              Включить или отключить видео на главной можно в разделе{" "}
              <Link href="/admin/site/hero" className="text-[#1D9E75] font-medium hover:underline">
                Главная страница → Видео на фоне
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* ── Storage options ───────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-raleway font-bold text-base text-gray-900">Варианты настройки хранилища</h2>
        </div>
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              name: "AWS S3",
              desc: "Надёжное хранилище от Amazon. Подходит для продакшена. Требует AWS-аккаунт.",
              badge: "Рекомендуется",
              badgeColor: "bg-[#1D9E75]/10 text-[#1D9E75]",
            },
            {
              name: "Supabase Storage",
              desc: "Простая настройка. Бесплатный тариф до 1 ГБ. Отлично подходит для старта.",
              badge: "Проще настроить",
              badgeColor: "bg-blue-50 text-blue-600",
            },
          ].map((opt) => (
            <div key={opt.name} className="border border-gray-100 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800 text-sm">{opt.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${opt.badgeColor}`}>
                  {opt.badge}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{opt.desc}</p>
            </div>
          ))}
        </div>
        <div className="px-6 pb-5">
          <Link
            href="/admin/system"
            className="inline-flex items-center gap-2 bg-[#1D9E75] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1D9E75]/90 transition-colors"
          >
            <StorageIcon />
            Перейти к настройкам системы
          </Link>
        </div>
      </div>

    </div>
  );
}
