/**
 * Сид базы данных — тестовые данные для разработки
 * Запуск: npm run db:seed
 */
import { PrismaClient, Role, Plan, SubscriptionStatus, OrderStatus, PaymentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Сидирование базы данных...");

  // Очищаем таблицы в правильном порядке
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // Создаём администратора
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      email: "admin@domas.ru",
      password: adminPassword,
      name: "Администратор",
      phone: "+7 (495) 000-00-00",
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Создан администратор: ${admin.email}`);

  // Создаём тестовых пользователей
  const userPassword = await bcrypt.hash("user123", 12);
  const user1 = await prisma.user.create({
    data: {
      email: "ivan@example.com",
      password: userPassword,
      name: "Иван Петров",
      phone: "+7 (916) 123-45-67",
      role: Role.USER,
      addresses: {
        create: [
          {
            label: "Дача в Истре",
            address: "МО, Истринский район, д. Подпорино, ул. Лесная, д. 12",
            isDefault: true,
          },
        ],
      },
    },
    include: { addresses: true },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "maria@example.com",
      password: userPassword,
      name: "Мария Соколова",
      phone: "+7 (926) 987-65-43",
      role: Role.USER,
      addresses: {
        create: [
          {
            label: "Коттедж в Рублёво",
            address: "МО, Одинцовский район, пос. Рублёво, ул. Сосновая, д. 5",
            isDefault: true,
          },
        ],
      },
    },
    include: { addresses: true },
  });
  console.log(`✅ Созданы тестовые пользователи`);

  // Подписка для user1
  const subscription1 = await prisma.subscription.create({
    data: {
      userId: user1.id,
      plan: Plan.COMFORT,
      status: SubscriptionStatus.ACTIVE,
      price: 3490,
      startDate: new Date("2024-01-01"),
    },
  });

  // Подписка для user2
  const subscription2 = await prisma.subscription.create({
    data: {
      userId: user2.id,
      plan: Plan.MAX,
      status: SubscriptionStatus.ACTIVE,
      price: 5990,
      startDate: new Date("2024-02-15"),
    },
  });
  console.log(`✅ Созданы подписки`);

  // Заказы для user1
  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      addressId: user1.addresses[0].id,
      serviceType: "waste_removal",
      status: OrderStatus.DONE,
      scheduledAt: new Date("2024-05-10T10:00:00"),
      completedAt: new Date("2024-05-10T11:30:00"),
      price: 0,
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: user1.id,
      addressId: user1.addresses[0].id,
      serviceType: "lawn_care",
      status: OrderStatus.IN_PROGRESS,
      scheduledAt: new Date("2024-05-25T09:00:00"),
      price: 0,
    },
  });

  const order3 = await prisma.order.create({
    data: {
      userId: user1.id,
      addressId: user1.addresses[0].id,
      serviceType: "waste_removal",
      status: OrderStatus.NEW,
      scheduledAt: new Date("2024-06-01T10:00:00"),
      price: 0,
    },
  });

  // Отзыв на выполненный заказ
  await prisma.review.create({
    data: {
      userId: user1.id,
      orderId: order1.id,
      rating: 5,
      comment: "Отличная работа! Приехали вовремя, всё чисто убрали.",
    },
  });

  // Платёж за подписку
  await prisma.payment.create({
    data: {
      userId: user1.id,
      subscriptionId: subscription1.id,
      amount: 3490,
      status: PaymentStatus.SUCCEEDED,
      provider: "yukassa",
      externalId: "demo-payment-001",
    },
  });

  console.log(`✅ Созданы заказы и платежи`);
  console.log(`\n🎉 Сидирование завершено!`);
  console.log(`\nТестовые аккаунты:`);
  console.log(`  Админ:     admin@domas.ru / admin123`);
  console.log(`  Клиент 1:  ivan@example.com / user123`);
  console.log(`  Клиент 2:  maria@example.com / user123`);
}

main()
  .catch((e) => {
    console.error("❌ Ошибка сидирования:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
