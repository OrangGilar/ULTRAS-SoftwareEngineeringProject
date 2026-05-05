import type { Metadata, Viewport } from "next";
import "./globals.css";

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
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
