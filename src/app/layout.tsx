import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ModalPortal } from "@/shared/ui/ModalPortal";
import { Header } from "@/widgets/Header/ui/Header";
import { Footer } from "@/widgets/Footer/ui/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Business Card Maker",
  description: "Create your own business card",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <ModalPortal />
      </body>
    </html>
  );
}
