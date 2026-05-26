import { TICKER_ITEMS } from "@/constants/services";

export function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="bg-[#0A0A0A] py-4 overflow-hidden border-y border-white/[0.06]">
      <div className="ticker-wrapper">
        <div className="ticker-track">
          {items.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-5 px-8 text-white/50 font-medium text-sm md:text-base whitespace-nowrap"
            >
              {item}
              <span className="text-brand-green text-base" aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
