import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import { APP_NAME } from "@/lib/constants";
import { uploadUrl } from "@/lib/http";
import { settingService } from "@/services/setting.service";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Favicon comes from the admin-configured WebSetting.fav_icon when present —
// falls back to the static app/favicon.ico convention (no `icons` field at
// all) if settings haven't been configured yet.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await settingService.get();
  const siteName = settings?.website_name || APP_NAME;
  const favIconUrl = uploadUrl("settings", settings?.fav_icon ?? undefined);

  return {
    title: {
      default: `${siteName} — Online Shopping for Fashion, Electronics & More`,
      template: `%s | ${siteName}`,
    },
    description:
      settings?.meta_description ||
      "Shop the latest fashion, electronics, home essentials and more at great prices, with fast delivery and easy cash-on-delivery checkout.",
    ...(favIconUrl ? { icons: { icon: favIconUrl } } : {}),
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <QueryProvider>
            <ErrorBoundary>{children}</ErrorBoundary>
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
