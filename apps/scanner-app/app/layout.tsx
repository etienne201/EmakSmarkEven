import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "../styles/design-system.css";
import { ServiceWorkerCleaner } from "@frontend/components/ServiceWorkerCleaner";
import { Metadata, Viewport } from 'next';
import { ToastProvider } from "@frontend/hooks/useToast";
import { AdminNavbar } from "@frontend/components/AdminNavbar";
import { ThemeProvider } from "@frontend/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "@frontend/context/AuthContext";
import { ActivityTracker } from "@frontend/components/ActivityTracker";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Invitations & Guest Management",
  description: "Create and manage your event invitations with QR codes, attendance tracking, and more.",
};

export const viewport: Viewport = {
  themeColor: "#004d40",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <ToastProvider>
            <ThemeProvider>
              <ServiceWorkerCleaner />
              <ActivityTracker />
              {children}
              {process.env.NODE_ENV === "production" && (
                <>
                  <Analytics />
                  <SpeedInsights />
                </>
              )}
            </ThemeProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
