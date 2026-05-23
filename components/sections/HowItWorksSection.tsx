const STEPS = [
  {
    number: "01",
    icon: "📋",
    title: "Выберите тариф или услугу",
    description:
      "Зарегистрируйтесь за 2 минуты, выберите подходящий тариф или разовую услугу и укажите адрес.",
  },
  {
    number: "02",
    icon: "📞",
    title: "Мы свяжемся удобным способом",
    description:
      "Менеджер свяжется в течение 5 минут, уточнит детали и согласует удобное расписание визитов.",
  },
  {
    number: "03",
    icon: "✅",
    title: "Наслаждайтесь результатом",
    description:
      "После каждой услуги вы оцениваете качество — это помогает нам становиться лучше.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-14">
          <span className="inline-block text-brand-green font-semibold text-sm uppercase tracking-wider mb-3">
            Как это работает
          </span>
          <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
            Три шага до комфорта
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Линия-соединитель (только desktop) */}
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-brand-green to-brand-green-light" />

          {STEPS.map((step, index) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {/* Иконка с номером */}
              <div className="relative mb-6">
                <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-brand-green-pale text-4xl">
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 bg-brand-green text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {index + 1}
                </span>
              </div>

              <h3 className="font-raleway font-bold text-xl text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-500 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
