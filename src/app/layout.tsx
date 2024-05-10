import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/globals.css";

// components
import Header from "../components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sandwich",
  description: "Welcome to the candy shop",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <header className="px-5 text-white bg-red-600">
            <Header />
          </header>

          <main className="px-5 flex-grow">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
