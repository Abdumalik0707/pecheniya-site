import type { Metadata } from "next";
import { Lilita_One, Rubik } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/lib/i18n";
import { TopBar } from "@/components/TopBar";
import "./globals.css";

// Bubbly display font for headings (Latin only). Cyrillic glyphs fall back to Rubik.
const lilita = Lilita_One({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-lilita",
  display: "swap",
  adjustFontFallback: false,
});

const rubik = Rubik({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pecheniya — Pechene va Shirinliklar Yetkazib Berish",
  description: "Toza va mazali pechene, vafli va shirinliklar — uyingizgacha yetkazib beramiz",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={`${lilita.variable} ${rubik.variable}`}>
        <ThemeProvider>
          <LanguageProvider>
            <TopBar />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
