import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { DesktopFooter } from "@/components/layout/DesktopFooter";
import { PwaRegister } from "@/components/pwa/PwaRegister";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const siteUrl = getSiteUrl();
const title = "Himnario Rayos de Esperanza";
const description = "Himnario PWA para la Iglesia de Dios en México.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${title}`
  },
  description,
  applicationName: title,
  appleWebApp: {
    capable: true,
    title: "Himnario"
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: siteUrl,
    siteName: title,
    title,
    description,
    images: [{ url: "/icon.svg", width: 512, height: 512, alt: title }]
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: ["/icon.svg"]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#002045"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <PwaRegister />
        <AppTopBar />
        <main className="mx-auto min-h-dvh w-full max-w-[720px] px-5 pb-36 pt-20 md:px-10 md:pb-40 lg:pb-4">
          {children}
        </main>
        <DesktopFooter />
        <BottomNavigation />
      </body>
    </html>
  );
}
