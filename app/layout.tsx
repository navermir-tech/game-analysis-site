import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { site } from "@/lib/site";

const playfair = localFont({
  src: [
    { path: "./fonts/playfair-display-latin-wght-normal.woff2", style: "normal" },
    { path: "./fonts/playfair-display-latin-ext-wght-normal.woff2", style: "normal" },
  ],
  variable: "--font-playfair-var",
  display: "swap",
  weight: "400 900",
});

const jetbrains = localFont({
  src: [
    { path: "./fonts/jetbrains-mono-latin-wght-normal.woff2", style: "normal" },
    { path: "./fonts/jetbrains-mono-latin-ext-wght-normal.woff2", style: "normal" },
  ],
  variable: "--font-jetbrains-var",
  display: "swap",
  weight: "100 800",
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: site.title,
    description: site.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${playfair.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
