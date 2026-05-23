import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });

  if (!user) redirect("/login");

  const pendingReview = await db.order.findFirst({
    where: { userId: session.user.id, status: "DONE", review: null },
  });

  return (
    <DashboardShell user={user} hasPendingReview={!!pendingReview}>
      {children}
    </DashboardShell>
  );
}
