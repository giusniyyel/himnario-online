import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { DesktopFooter } from "@/components/layout/DesktopFooter";
import { PwaRegister } from "@/components/pwa/PwaRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Himnario Rayos de Esperanza",
    template: "%s | Himnario Rayos de Esperanza"
  },
  description: "Himnario PWA para la Iglesia de Dios en México.",
  applicationName: "Himnario Rayos de Esperanza",
  appleWebApp: {
    capable: true,
    title: "Himnario"
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
