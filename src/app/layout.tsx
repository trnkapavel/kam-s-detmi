import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kam s dětmi",
  description: "Tipy na aktivity podle nálady, počasí a přání dětí",
  applicationName: "Kam s dětmi",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0284c7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
