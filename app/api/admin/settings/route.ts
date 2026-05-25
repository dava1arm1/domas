import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllSettings, saveSettings } from "@/lib/settings";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

// GET /api/admin/settings — all settings (DB + defaults)
export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const settings = await getAllSettings();
  return NextResponse.json(settings);
}

// PATCH /api/admin/settings — upsert one or many settings
export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    await saveSettings(body);
  } catch (err) {
    console.error("[settings PATCH] DB error:", err);
    return NextResponse.json(
      { error: "Ошибка базы данных. Убедитесь что выполнен npx prisma db push." },
      { status: 500 }
    );
  }

  // Log admin action (non-critical)
  try {
    await db.activityLog.create({
      data: {
        adminId: session.user.id,
        action:  "UPDATE_SETTING",
        detail:  `Обновлено: ${Object.keys(body).join(", ")}`,
      },
    });
  } catch { /* non-critical */ }

  return NextResponse.json({ ok: true });
}
