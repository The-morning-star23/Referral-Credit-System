import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"; // <-- Import Toaster

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Referral & Credit System",
  description: "Full stack referral assignment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Toaster position="top-center" reverseOrder={false} />
        <main className="min-h-screen bg-gray-900 text-white">
          {children}
        </main>
      </body>
    </html>
  );
}