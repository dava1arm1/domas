import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RevealInit } from "@/components/sections/service/RevealInit";

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <RevealInit />
      <main>{children}</main>
      <Footer />
    </>
  );
}
