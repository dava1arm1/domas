import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { SettingsPageClient } from "./SettingsPageClient";

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
    <SettingsPageClient
      name={user.name ?? ""}
      email={user.email ?? ""}
      phone={user.phone}
    />
  );
}
