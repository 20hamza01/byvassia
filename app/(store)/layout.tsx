import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { Atmosphere } from "@/components/Atmosphere";
import { LanguageProvider } from "@/components/LanguageProvider";
import { getLocale } from "@/lib/locale-server";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <LanguageProvider initialLocale={locale}>
      <Atmosphere />
      <Header />
      <CartDrawer />
      <main className="relative z-[2] min-h-screen">{children}</main>
      <Footer />
    </LanguageProvider>
  );
}
