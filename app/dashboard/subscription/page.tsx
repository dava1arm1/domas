import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/utils";
import { PLAN_LABELS, MAIN_SUBSCRIPTION } from "@/constants/pricing";

export const metadata = { title: "Подписка" };

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const subscription = await db.subscription.findFirst({
    where: { userId: session.user.id, status: { in: ["ACTIVE", "PAUSED"] } },
  });

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-raleway font-black text-2xl text-gray-900 mb-6">Подписка</h1>

        {subscription ? (
          <div className="space-y-4">
            <div className="bg-brand-dark rounded-2xl p-8">
              <span className="inline-block bg-brand-green/20 text-brand-green-light text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                Активна
              </span>
              <h2 className="font-raleway font-black text-3xl text-white mb-1">
                {PLAN_LABELS[subscription.plan] ?? subscription.plan}
              </h2>
              <p className="text-white/50 text-sm mb-6">с {formatDate(subscription.startDate)}</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="font-raleway font-black text-4xl text-brand-green-light">
                  {formatPrice(subscription.price)}
                </span>
                <span className="text-white/40">/мес</span>
              </div>
              <ul className="space-y-3">
                {MAIN_SUBSCRIPTION.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-white/70 text-sm">
                    <svg className="h-4 w-4 text-brand-green-light flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button className="bg-white border border-gray-200 hover:border-brand-green text-gray-700 hover:text-brand-green font-semibold py-3 rounded-xl transition-all text-sm">
                Сменить тариф
              </button>
              <button className="bg-white border border-gray-200 hover:border-red-300 text-gray-400 hover:text-red-500 font-semibold py-3 rounded-xl transition-all text-sm">
                Отменить подписку
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
            <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <p className="font-semibold text-gray-700 mb-2">Нет активной подписки</p>
            <p className="text-gray-400 text-sm mb-6">Выберите тариф и начните пользоваться сервисом</p>
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all"
            >
              Выбрать тариф
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
