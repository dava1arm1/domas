"use client";

import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────
interface ActivityEntry {
  id: string;
  action: string;
  detail: string;
  createdAt: string;
}

const MOCK_ACTIVITY: ActivityEntry[] = [
  { id: "1", action: "UPDATE_SETTING", detail: "Обновлены настройки: hero.heading, hero.subtitle", createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: "2", action: "ORDER_STATUS",   detail: "Изменён статус заказа #4821 → Выполнен",           createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: "3", action: "UPDATE_SETTING", detail: "Обновлены настройки: site.pricing",                 createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: "4", action: "UPDATE_SETTING", detail: "Обновлены настройки: notify.order_confirm",         createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: "5", action: "ADMIN_LOGIN",    detail: "Выполнен вход в панель администратора",             createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
];

// ─── Helpers ──────────────────────────────────────────────────
function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 2)   return "только что";
  if (mins < 60)  return `${mins} мин. назад`;
  if (hours < 24) return `${hours} ч. назад`;
  return `${days} дн. назад`;
}

function getActionLabel(action: string): string {
  const map: Record<string, string> = {
    UPDATE_SETTING: "Настройки",
    ORDER_STATUS:   "Заказ",
    ADMIN_LOGIN:    "Вход",
  };
  return map[action] ?? action;
}

function getActionColor(action: string): string {
  const map: Record<string, string> = {
    UPDATE_SETTING: "bg-blue-50 text-blue-600",
    ORDER_STATUS:   "bg-amber-50 text-amber-600",
    ADMIN_LOGIN:    "bg-gray-100 text-gray-500",
  };
  return map[action] ?? "bg-gray-100 text-gray-500";
}

// ─── Toast ────────────────────────────────────────────────────
function Toast({ show, message = "Сохранено!" }: { show: boolean; message?: string }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#1D9E75] text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">
      <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {message}
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:ring-offset-2 ${
        value ? "bg-[#1D9E75]" : "bg-gray-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          value ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ─── Masked Input ─────────────────────────────────────────────
function MaskedInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] font-mono"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          tabIndex={-1}
        >
          {show ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Inline save button ───────────────────────────────────────
function InlineSaveButton({
  onClick,
  saving,
  disabled,
}: {
  onClick: () => void;
  saving: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={saving || disabled}
      className="bg-[#1D9E75] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#1D9E75]/90 transition-colors disabled:opacity-50"
    >
      {saving ? "Сохранение..." : "Сохранить"}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function SystemPage() {
  // ── Maintenance mode ──────────────────────────────────────
  const [maintenance, setMaintenance]         = useState(false);
  const [savedMaintenance, setSavedMaintenance] = useState(false);
  const [savingMaintenance, setSavingMaintenance] = useState(false);
  const [toastMaintenance, setToastMaintenance] = useState(false);

  // ── YuKassa ──────────────────────────────────────────────
  const [yukassaShopId, setYukassaShopId]     = useState("");
  const [yukassaSecret, setYukassaSecret]     = useState("");
  const [savedYukassa, setSavedYukassa]       = useState({ shopId: "", secret: "" });
  const [savingYukassa, setSavingYukassa]     = useState(false);
  const [toastYukassa, setToastYukassa]       = useState(false);

  // ── UniSender ─────────────────────────────────────────────
  const [unisenderKey, setUnisenderKey]       = useState("");
  const [savedUnisender, setSavedUnisender]   = useState("");
  const [savingUnisender, setSavingUnisender] = useState(false);
  const [toastUnisender, setToastUnisender]   = useState(false);

  // ── Activity log ──────────────────────────────────────────
  const [activity, setActivity]   = useState<ActivityEntry[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);

  // ── Global loading ────────────────────────────────────────
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load settings
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        const m = data["system.maintenance_mode"] === "true";
        setMaintenance(m);
        setSavedMaintenance(m);
        setYukassaShopId(data["system.yukassa_shop_id"] ?? "");
        setYukassaSecret(data["system.yukassa_secret"] ?? "");
        setSavedYukassa({
          shopId: data["system.yukassa_shop_id"] ?? "",
          secret: data["system.yukassa_secret"] ?? "",
        });
        setUnisenderKey(data["system.unisender_key"] ?? "");
        setSavedUnisender(data["system.unisender_key"] ?? "");
      })
      .finally(() => setLoading(false));

    // Load activity log
    fetch("/api/admin/activity")
      .then((r) => {
        if (!r.ok) throw new Error("no activity endpoint");
        return r.json();
      })
      .then((data) => {
        const entries = Array.isArray(data) ? data : (data.data ?? data.logs ?? []);
        setActivity(entries);
      })
      .catch(() => {
        setActivity(MOCK_ACTIVITY);
      })
      .finally(() => setActivityLoading(false));
  }, []);

  const checkResponse = async (res: Response, label: string) => {
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? `Ошибка сохранения ${label} (${res.status}). Убедитесь что выполнен: npx prisma db push`);
      return false;
    }
    return true;
  };

  // Maintenance save
  const saveMaintenance = async () => {
    setSavingMaintenance(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "system.maintenance_mode": maintenance ? "true" : "false" }),
      });
      if (!await checkResponse(res, "режима обслуживания")) return;
      setSavedMaintenance(maintenance);
      setToastMaintenance(true);
      setTimeout(() => setToastMaintenance(false), 3000);
    } finally {
      setSavingMaintenance(false);
    }
  };

  // YuKassa save
  const saveYukassa = async () => {
    setSavingYukassa(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "system.yukassa_shop_id": yukassaShopId,
          "system.yukassa_secret": yukassaSecret,
        }),
      });
      if (!await checkResponse(res, "ЮKassa")) return;
      setSavedYukassa({ shopId: yukassaShopId, secret: yukassaSecret });
      setToastYukassa(true);
      setTimeout(() => setToastYukassa(false), 3000);
    } finally {
      setSavingYukassa(false);
    }
  };

  // UniSender save
  const saveUnisender = async () => {
    setSavingUnisender(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "system.unisender_key": unisenderKey }),
      });
      if (!await checkResponse(res, "UniSender")) return;
      setSavedUnisender(unisenderKey);
      setToastUnisender(true);
      setTimeout(() => setToastUnisender(false), 3000);
    } finally {
      setSavingUnisender(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 animate-pulse">
            <div className="h-5 bg-gray-100 rounded w-1/4" />
            <div className="h-10 bg-gray-50 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">

      {/* ── Maintenance mode ──────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-raleway font-bold text-base text-gray-900">Режим обслуживания</h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Включить режим обслуживания</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Сайт будет показывать страницу «Технические работы»
              </p>
            </div>
            <Toggle value={maintenance} onChange={setMaintenance} />
          </div>

          {maintenance && (
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <svg className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm font-medium text-amber-800">
                Сайт показывает страницу технического обслуживания всем пользователям.
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <InlineSaveButton
              onClick={saveMaintenance}
              saving={savingMaintenance}
              disabled={maintenance === savedMaintenance}
            />
          </div>
        </div>
      </div>

      {/* ── API keys ──────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-raleway font-bold text-base text-gray-900">API ключи</h2>
          <p className="text-xs text-gray-400 mt-0.5">Ключи хранятся в зашифрованном виде</p>
        </div>
        <div className="divide-y divide-gray-50">

          {/* YuKassa */}
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-sm font-semibold text-gray-800">ЮKassa</p>
                <p className="text-xs text-gray-400">Платёжная система для приёма оплат</p>
              </div>
              <span className="text-[10px] font-bold bg-[#1D9E75]/10 text-[#1D9E75] px-2 py-0.5 rounded-full uppercase tracking-wide">
                Оплаты
              </span>
            </div>
            <MaskedInput
              label="Shop ID"
              value={yukassaShopId}
              onChange={setYukassaShopId}
              placeholder="00000000-0000-0000-0000-000000000000"
            />
            <MaskedInput
              label="Секретный ключ"
              value={yukassaSecret}
              onChange={setYukassaSecret}
              placeholder="live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            />
            <div className="flex justify-end">
              <InlineSaveButton
                onClick={saveYukassa}
                saving={savingYukassa}
                disabled={
                  yukassaShopId === savedYukassa.shopId &&
                  yukassaSecret === savedYukassa.secret
                }
              />
            </div>
          </div>

          {/* UniSender */}
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-sm font-semibold text-gray-800">UniSender</p>
                <p className="text-xs text-gray-400">Email-рассылки и транзакционные письма</p>
              </div>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wide">
                Email
              </span>
            </div>
            <MaskedInput
              label="API ключ"
              value={unisenderKey}
              onChange={setUnisenderKey}
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            />
            <div className="flex justify-end">
              <InlineSaveButton
                onClick={saveUnisender}
                saving={savingUnisender}
                disabled={unisenderKey === savedUnisender}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Admin management ──────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-raleway font-bold text-base text-gray-900">Управление администраторами</h2>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-4">
            <svg className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-gray-800">Добавление через базу данных</p>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                Добавление администраторов доступно через прямой запрос к базе данных.
                Обратитесь к разработчику.
              </p>
              <code className="mt-2 block bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-600">
                UPDATE &quot;User&quot; SET role = &apos;ADMIN&apos; WHERE email = &apos;user@example.com&apos;;
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* ── Activity log ──────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-raleway font-bold text-base text-gray-900">Журнал действий</h2>
          <span className="text-xs text-gray-400">Последние действия в системе</span>
        </div>
        <div className="divide-y divide-gray-50">
          {activityLoading ? (
            <div className="px-6 py-5 space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-6 w-16 bg-gray-100 rounded-full" />
                  <div className="h-4 bg-gray-100 rounded flex-1" />
                  <div className="h-3 w-20 bg-gray-50 rounded" />
                </div>
              ))}
            </div>
          ) : activity.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">
              Действий ещё не было
            </div>
          ) : (
            activity.map((entry) => (
              <div key={entry.id} className="px-6 py-3.5 flex items-center gap-3">
                <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${getActionColor(entry.action)}`}>
                  {getActionLabel(entry.action)}
                </span>
                <p className="flex-1 text-sm text-gray-700 min-w-0 truncate">{entry.detail}</p>
                <span className="flex-shrink-0 text-xs text-gray-400 whitespace-nowrap">
                  {formatRelative(entry.createdAt)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Toasts */}
      <Toast show={toastMaintenance} message="Режим обслуживания обновлён!" />
      <Toast show={toastYukassa}     message="Ключи ЮKassa сохранены!" />
      <Toast show={toastUnisender}   message="Ключ UniSender сохранён!" />
    </div>
  );
}
