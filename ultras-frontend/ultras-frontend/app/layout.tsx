import type { Metadata } from "next";
import "./globals.css";
import { BottomNav } from "./components/Bottomnav";

export const metadata: Metadata = {
  title: "Ultras App",
  description: "Fan app for the terraces",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black flex justify-center">
        {/* Mobile Container Wrapper */}
        <div className="w-full max-w-md bg-slate-950 relative shadow-2xl overflow-hidden min-h-screen font-sans">
          
          {/* Universal Red Header */}
          <div className="bg-red-600 pt-12 pb-4 px-6 rounded-b-3xl shadow-lg flex justify-between items-center sticky top-0 z-50">
            <h1 className="text-2xl font-black tracking-widest text-white">ULTRAS</h1>
            <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white overflow-hidden text-slate-800 flex items-center justify-center font-bold text-xs">
              Pic
            </div>
          </div>

          {/* This is where the specific page content loads */}
          <main className="pb-24">
            {children}
          </main>

          {/* Persistent Bottom Nav */}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
