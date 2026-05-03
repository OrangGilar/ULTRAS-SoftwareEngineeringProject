import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ultras — for the terraces",
  description:
    "The fan engagement platform for Liga 1 supporters. Predict, debate, earn.",
};

export const viewport: Viewport = {
  themeColor: "#0b0f14",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
