import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

// GET /api/admin/orders?status=NEW&service=&search=&page=1&limit=50
export async function GET(req: NextRequest) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status  = searchParams.get("status") || "";
  const service = searchParams.get("service") || "";
  const search  = searchParams.get("search") || "";
  const page    = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit   = Math.min(100, parseInt(searchParams.get("limit") || "50"));

  const where: Record<string, unknown> = {};
  if (status  && status  !== "ALL") where.status      = status;
  if (service && service !== "ALL") where.serviceType = service;
  if (search) {
    where.user = {
      OR: [
        { name:  { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  const [total, orders] = await Promise.all([
    db.order.count({ where }),
    db.order.findMany({
      where,
      include: {
        user:    { select: { id: true, name: true, email: true, phone: true } },
        address: true,
        review:  true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({ orders, total, page, limit, totalPages: Math.ceil(total / limit) });
}
