import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { title: "Мои адреса" };

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const addresses = await db.address.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="flex-1 overflow-y-auto overscroll-contain">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8" style={{ paddingBottom: "calc(72px + env(safe-area-inset-bottom) + 2rem)" }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-raleway font-black text-2xl text-gray-900">Мои адреса</h1>
          <button className="inline-flex items-center gap-1.5 bg-brand-green hover:bg-brand-green/90 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all active:scale-95">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Добавить адрес
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
            <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="font-semibold text-gray-600 mb-1">Адресов пока нет</p>
            <p className="text-gray-400 text-sm">Добавьте адрес, чтобы мастер знал куда приехать</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-brand-green-pale flex items-center justify-center flex-shrink-0">
                  <svg className="h-5 w-5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{addr.label}</p>
                  <p className="text-gray-400 text-sm mt-0.5">{addr.address}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
