import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import Background from "@/components/Background";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import FlashAlert from "@/components/FlashAlert";
import { ModalProvider } from "@/components/ModalContext";
import { AuthProvider } from "@/components/AuthProvider";
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

export const metadata: Metadata = {
  title: "MonAgentPerso — Agent IA métier personnalisé, livré sous 24h",
  description:
    "Votre agent IA professionnel personnalisé selon votre métier, vos règles et vos documents. Livraison sous 24h sur ChatGPT, Claude ou Gemini.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <AuthProvider initialUser={user}>
          <ModalProvider>
            <Background />
            <Nav />
            <main>{children}</main>
            <Footer />
            <Modal />
            <FlashAlert />
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
