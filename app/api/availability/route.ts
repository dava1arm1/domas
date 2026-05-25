export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

const ALL_SLOTS = [
  "09:00–11:00",
  "10:00–12:00",
  "11:00–13:00",
  "13:00–15:00",
  "14:00–16:00",
  "15:00–17:00",
  "16:00–18:00",
  "17:00–19:00",
];

const SUNDAY_UNAVAILABLE = ["16:00–18:00", "17:00–19:00"];

// GET /api/availability?date=YYYY-MM-DD&service=service_id
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Параметр date обязателен и должен быть в формате YYYY-MM-DD" },
      { status: 400 }
    );
  }

  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    return NextResponse.json({ error: "Некорректная дата" }, { status: 400 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  parsed.setHours(0, 0, 0, 0);

  // Если дата в прошлом — все слоты недоступны
  if (parsed < today) {
    return NextResponse.json({
      date,
      available: [],
      unavailable: ALL_SLOTS,
    });
  }

  const dayOfWeek = parsed.getDay(); // 0 = воскресенье

  // Воскресенье — вечерние слоты недоступны
  if (dayOfWeek === 0) {
    const available = ALL_SLOTS.filter((s) => !SUNDAY_UNAVAILABLE.includes(s));
    return NextResponse.json({
      date,
      available,
      unavailable: SUNDAY_UNAVAILABLE,
    });
  }

  return NextResponse.json({
    date,
    available: ALL_SLOTS,
    unavailable: [],
  });
}
