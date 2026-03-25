import type { Metadata } from "next";
import { Playfair_Display, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sparrowhawk Editor",
  description: "CMS for sparrowhawk.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${newsreader.variable} ${jetbrains.variable}`}>
      <body className="bg-[#FAF6F1] text-[#1a1a2e] antialiased">
        {children}
      </body>
    </html>
  );
}
