// Root layout — оборачивает всё приложение
import type { Metadata } from "next";
import { Raleway, Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/layout/SessionProvider";

const raleway = Raleway({
  subsets: ["latin", "cyrillic"],
  variable: "--font-raleway",
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Домас — обслуживание частных домов в Москве и МО",
    template: "%s | Домас",
  },
  description:
    "Премиальный сервис по обслуживанию загородных домов. Вывоз мусора, уход за участком, откачка септика, уборка снега. Один сервис — все задачи.",
  keywords: [
    "обслуживание дома",
    "загородный дом",
    "вывоз мусора",
    "уход за участком",
    "откачка септика",
    "Москва",
    "Московская область",
  ],
  openGraph: {
    title: "Домас — обслуживание частных домов",
    description: "Один сервис закрывает все задачи вашего дома",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Домас",
    locale: "ru_RU",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${raleway.variable} ${inter.variable}`}>
      <body className="min-h-screen">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
