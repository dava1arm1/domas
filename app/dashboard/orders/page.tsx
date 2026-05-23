import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { SERVICE_LABELS } from "@/constants/services";

const statusVariantMap: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  NEW: "info", IN_PROGRESS: "warning", DONE: "success", CANCELLED: "danger",
};

const statusLabels: Record<string, string> = {
  NEW: "Новый", IN_PROGRESS: "В работе", DONE: "Выполнен", CANCELLED: "Отменён",
};

export const metadata = { title: "Мои заказы" };

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: { address: true, review: true },
    orderBy: { scheduledAt: "desc" },
  });

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-raleway font-black text-2xl text-gray-900 mb-6">Мои заказы</h1>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {orders.length === 0 ? (
            <div className="py-16 text-center">
              <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <svg className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="font-semibold text-gray-600 mb-1">Заказов пока нет</p>
              <p className="text-gray-400 text-sm">История появится здесь после первого визита</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {orders.map((order) => (
                <div key={order.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50/70 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {SERVICE_LABELS[order.serviceType] ?? order.serviceType}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">{formatDate(order.scheduledAt)}</p>
                    {order.address && (
                      <p className="text-gray-400 text-xs mt-0.5 truncate">📍 {order.address.address}</p>
                    )}
                  </div>
                  <Badge variant={statusVariantMap[order.status] ?? "default"}>
                    {statusLabels[order.status] ?? order.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
