import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { title: "Настройки" };

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true },
  });

  if (!user) redirect("/login");

  return (
    <main className="flex-1 overflow-y-auto overscroll-contain">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8" style={{ paddingBottom: "calc(72px + env(safe-area-inset-bottom) + 2rem)" }}>
        <h1 className="font-raleway font-black text-2xl text-gray-900 mb-6">Настройки</h1>

        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          {/* Profile */}
          <div className="p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Личные данные</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Имя
                </label>
                <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-900 text-sm">{user.name}</span>
                  <button className="text-brand-green text-xs font-semibold hover:underline">Изменить</button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Email
                </label>
                <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-900 text-sm">{user.email}</span>
                  <button className="text-brand-green text-xs font-semibold hover:underline">Изменить</button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Телефон
                </label>
                <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-900 text-sm">{user.phone ?? "Не указан"}</span>
                  <button className="text-brand-green text-xs font-semibold hover:underline">Изменить</button>
                </div>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Безопасность</h2>
            <button className="text-sm font-semibold text-brand-green hover:underline">
              Изменить пароль →
            </button>
          </div>

          {/* Danger zone */}
          <div className="p-6">
            <h2 className="font-semibold text-gray-900 mb-1">Удаление аккаунта</h2>
            <p className="text-gray-400 text-sm mb-4">Это действие необратимо. Все данные будут удалены.</p>
            <button className="text-sm font-semibold text-red-500 hover:underline">
              Удалить аккаунт
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
