import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../src/utils/provider";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AuctionBay App - The best place to buy and sell",
  description: "AuctionBay is a premier auction app where you can bid on your favorite items, sell your goods, and enjoy the thrill of the auction. Join us today!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <ToastContainer position="bottom-left"/>
      </body>
    </html>
  );
}
