import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Background from "@/components/Background";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import FlashAlert from "@/components/FlashAlert";
import FaqChatbot from "@/components/FaqChatbot";
import AffiliateTracker from "@/components/AffiliateTracker";
import WheelModal from "@/components/wheel/WheelModal";
import { ModalProvider } from "@/components/ModalContext";
import { AuthProvider } from "@/components/AuthProvider";
import { LocaleProvider } from "@/lib/i18n/context";
import { getLocale, dictFor } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800", "900"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = dictFor(locale);
  return {
    title: t.metadata.title,
    description: t.metadata.description,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const locale = await getLocale();
  const dict = dictFor(locale);

  return (
    <html lang={locale} className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <LocaleProvider locale={locale} dict={dict}>
          <AuthProvider initialUser={user}>
            <ModalProvider>
              <AffiliateTracker />
              <Background />
              <Nav />
              <main>{children}</main>
              <Footer />
              <Modal />
              <WheelModal />
              <FlashAlert />
              <FaqChatbot />
            </ModalProvider>
          </AuthProvider>
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
