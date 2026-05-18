import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cleno — Toronto Home Cleaning",
  description: "Come home to clean. Cleno takes cleaning off your plate so your evenings and weekends are actually yours again. Toronto-based, insured, flexible scheduling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-[#1a1a18]">{children}</body>
    </html>
  );
}
