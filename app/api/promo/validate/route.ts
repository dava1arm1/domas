export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

interface PromoCode {
  discount: number;
}

const PROMO_CODES: Record<string, PromoCode> = {
  DOMAS10: { discount: 10 },
  DOMAS20: { discount: 20 },
  FIRST15: { discount: 15 },
};

// POST /api/promo/validate
// Body: { code: string, serviceId?: string }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const rawCode: string = body.code ?? "";
  const code = rawCode.trim().toUpperCase();

  const promo = PROMO_CODES[code];

  if (promo) {
    return NextResponse.json({
      valid: true,
      discount: promo.discount,
      message: `Промокод применён — скидка ${promo.discount}%`,
    });
  }

  return NextResponse.json(
    { valid: false, error: "Промокод не найден или истёк срок действия" },
    { status: 404 }
  );
}
