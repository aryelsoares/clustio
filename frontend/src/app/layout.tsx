import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import "../lib/fontawesome";

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600'] });

export const metadata: Metadata = {
  title: "Clustio",
  description: "",
  authors: [{ name: "Aryel Soares"}],
  keywords: ["Test"]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} min-h-screen flex flex-col bg-bg text-text`}>

        <main className="flex-1">
          {children}
        </main>

      </body>
    </html>
  );
}
