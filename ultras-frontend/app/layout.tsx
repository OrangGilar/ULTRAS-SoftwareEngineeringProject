import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClubsProvider } from "@/components/providers/ClubsProvider";
import { GamesProvider } from "@/components/providers/GamesProvider";

export const metadata: Metadata = {
  title: "Ultras. For the terraces.",
  description:
    "The fan engagement platform for Liga 1 supporters. Predict. Debate. Earn.",
};
export const viewport: Viewport = {
  themeColor: "#ff1841",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital@1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans antialiased">
        <ClubsProvider><GamesProvider>{children}</GamesProvider></ClubsProvider>
      </body>
    </html>
  );
}
