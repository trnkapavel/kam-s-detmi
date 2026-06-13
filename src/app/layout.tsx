import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppBackground } from "@/components/ui/AppBackground";
import { SafariChromeTint } from "@/components/ui/SafariChromeTint";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kam s dětmi",
  description: "Tipy na aktivity podle nálady, počasí a přání dětí",
  applicationName: "Kam s dětmi",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#5645d4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">
        <SafariChromeTint />
        <AppBackground>{children}</AppBackground>
      </body>
    </html>
  );
}
