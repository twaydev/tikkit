import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || defaultUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tikkit - Tiny Ticket System for Solo Entrepreneurs",
    template: "%s | Tikkit",
  },
  description: "A simple, powerful ticket system designed for solo entrepreneurs. Organize, track, and manage your work without the complexity. Built for solo entrepreneurs who need a lightweight, privacy-first solution.",
  keywords: [
    "ticket system",
    "solo entrepreneur",
    "task management",
    "project management",
    "productivity",
    "ticket tracking",
    "solo business",
    "freelancer tools",
    "small business",
    "work organization",
    "privacy-first",
    "lightweight CRM",
  ],
  authors: [{ name: "Tikkit Team" }],
  creator: "Tikkit",
  publisher: "Tikkit",
  applicationName: "Tikkit",
  category: "Productivity",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Tikkit",
    title: "Tikkit - Tiny Ticket System for Solo Entrepreneurs",
    description: "A simple, powerful ticket system designed for solo entrepreneurs. Organize, track, and manage your work without the complexity.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Tikkit - Tiny Ticket System for Solo Entrepreneurs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tikkit - Tiny Ticket System for Solo Entrepreneurs",
    description: "A simple, powerful ticket system designed for solo entrepreneurs. Organize, track, and manage your work without the complexity.",
    images: ["/twitter-image.png"],
    creator: "@tikkit",
    site: "@tikkit",
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Tikkit",
    "mobile-web-app-capable": "yes",
    "theme-color": "#9333ea", // Purple theme color
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
