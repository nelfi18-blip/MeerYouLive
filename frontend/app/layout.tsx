import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeetYouLive",
  description: "MeetYouLive — plataforma de streaming en vivo",
  metadataBase: new URL("https://meetyoulive.net"),
  openGraph: {
    title: "MeetYouLive",
    description: "MeetYouLive — plataforma de streaming en vivo",
    url: "https://meetyoulive.net",
    siteName: "MeetYouLive",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "MeetYouLive",
    description: "MeetYouLive — plataforma de streaming en vivo",
  },
  alternates: {
    canonical: "https://meetyoulive.net",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
