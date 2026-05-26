import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export const metadata = { title: "Подписка" };

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <main className="flex-1 overflow-y-auto overscroll-contain">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8" style={{ paddingBottom: "calc(72px + env(safe-area-inset-bottom) + 2rem)" }}>
        <h1 className="font-raleway font-black text-2xl text-gray-900 mb-6">Подписка</h1>

        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <div className="h-14 w-14 rounded-2xl bg-brand-green-pale flex items-center justify-center mx-auto mb-5">
            <svg className="h-7 w-7 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="font-raleway font-black text-xl text-gray-900 mb-2">Подписки в разработке</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
            Мы работаем над системой подписок. Скоро всё будет готово — следите за обновлениями.
          </p>
          <Link
            href="/#contacts"
            className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all"
          >
            Узнать подробности
          </Link>
        </div>
      </div>
    </main>
  );
}
