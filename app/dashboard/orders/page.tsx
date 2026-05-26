import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrdersClient } from "./OrdersClient";

export const metadata = { title: "Мои заказы" };
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: { address: true, review: true },
    orderBy: { createdAt: "desc" },
  });

  // Serialize for client (convert Dates to strings)
  const serialized = orders.map((o) => ({
    id: o.id,
    serviceType: o.serviceType,
    status: o.status,
    scheduledAt: o.scheduledAt.toISOString(),
    orderNumber: o.orderNumber ?? null,
    confirmedDate: o.confirmedDate?.toISOString() ?? null,
    confirmedTimeSlot: o.confirmedTimeSlot ?? null,
    confirmedPrice: o.confirmedPrice ?? null,
    adminNote: o.adminNote ?? null,
    timeSlot: o.timeSlot ?? null,
    comment: o.comment ?? null,
    address: o.address
      ? { id: o.address.id, address: o.address.address, label: o.address.label }
      : null,
    review: o.review
      ? { id: o.review.id, rating: o.review.rating, comment: o.review.comment ?? null }
      : null,
  }));

  return <OrdersClient initialOrders={serialized} />;
}
