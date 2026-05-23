import Link from "next/link";

export function ReviewsSection() {
  return (
    <section id="reviews" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-14">
          <span className="inline-block text-brand-green font-semibold text-sm uppercase tracking-wider mb-3">
            Отзывы
          </span>
          <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
            Что говорят наши клиенты
          </h2>
        </div>

        {/* Пустое состояние */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-surface-secondary rounded-3xl px-8 py-16">
            {/* Иконка */}
            <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-brand-green-pale mx-auto mb-6">
              <svg
                className="h-10 w-10 text-brand-green"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
            </div>

            <h3 className="font-raleway font-black text-2xl text-gray-900 mb-4">
              Будьте первыми
            </h3>
            <p className="text-gray-500 leading-relaxed mb-8 max-w-md mx-auto">
              Будьте первыми, кто оценит наш сервис и поможет нам стать лучше.
              После каждого визита вы сможете оставить отзыв прямо в личном кабинете.
            </p>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95"
            >
              Подключить сервис
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
