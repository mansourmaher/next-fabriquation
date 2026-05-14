import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Gestion des Ordres de Fabrication",
  description: "Système de gestion des ordres de fabrication",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${mono.variable} antialiased bg-neutral-950 text-neutral-100`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64 p-8 min-h-screen bg-neutral-950">{children}</main>
        </div>
      </body>
    </html>
  );
}
