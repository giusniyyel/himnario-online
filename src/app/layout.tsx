import type { Viewport } from "next";
import type { ReactNode } from "react";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { PwaRegister } from "@/components/pwa/PwaRegister";
import { StructuredData } from "@/components/seo/StructuredData";
import { createRootMetadata, site } from "@/lib/site-metadata";
import "./globals.css";

export const metadata = createRootMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: site.themeColor },
    { media: "(prefers-color-scheme: dark)", color: site.themeColor }
  ],
  colorScheme: "light dark"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={site.language} suppressHydrationWarning>
      <body className="antialiased">
        <StructuredData />
        <PwaRegister />
        <AppTopBar />
        <main className="main-with-top-bar main-with-bottom-nav mx-auto min-h-dvh w-full max-w-[720px] px-5 md:px-10 lg:pb-4">
          {children}
        </main>
        <BottomNavigation />
      </body>
    </html>
  );
}
