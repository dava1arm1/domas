import { TICKER_ITEMS } from "@/constants/services";

export function Ticker() {
  // Дублируем список чтобы лента была бесконечной при скролле
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="bg-brand-green py-4 overflow-hidden">
      <div className="ticker-wrapper">
        <div className="ticker-track">
          {items.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-4 px-8 text-white font-semibold text-base md:text-lg whitespace-nowrap"
            >
              {item}
              <span className="text-brand-green-light text-xl" aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
