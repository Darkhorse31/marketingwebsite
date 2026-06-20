import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/animations/SmoothScroll";
import DropletCanvas from "@/components/droplet/DropletCanvas";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Aura | Luxury Beauty Exhibition",
  description: "An immersive digital experience showcasing premium luxury beauty products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <DropletCanvas />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
