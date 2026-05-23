// Zod-схемы валидации — используются и на клиенте и на сервере
import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(100, "Имя слишком длинное"),
  email: z
    .string()
    .email("Введите корректный email")
    .toLowerCase(),
  password: z
    .string()
    .min(6, "Пароль должен содержать минимум 6 символов")
    .max(100, "Пароль слишком длинный"),
  phone: z
    .string()
    .regex(/^[\+]?[0-9\s\-\(\)]{10,15}$/, "Введите корректный номер телефона")
    .optional()
    .or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().email("Введите корректный email").toLowerCase(),
  password: z.string().min(1, "Введите пароль"),
});

export const reviewSchema = z.object({
  orderId: z.string().cuid("Некорректный ID заказа"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000, "Комментарий слишком длинный").optional(),
});

export const orderSchema = z.object({
  serviceType: z.enum([
    "waste_removal",
    "construction_waste",
    "lawn_care",
    "septic_pumping",
    "snow_removal",
    "cleaning",
  ]),
  scheduledAt: z.string().datetime("Некорректная дата"),
  addressId: z.string().cuid().optional(),
  comment: z.string().max(500).optional(),
});

export const sendEmailSchema = z.object({
  subject: z.string().min(1, "Введите тему письма").max(200),
  body: z.string().min(1, "Введите текст письма"),
  segment: z.enum(["ALL", "ACTIVE", "CANCELLED"]).default("ALL"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type SendEmailInput = z.infer<typeof sendEmailSchema>;
