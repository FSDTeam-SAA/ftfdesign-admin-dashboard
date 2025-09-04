import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Providers from "@/components/provider/QueryClientProvider";
import { Toaster } from "sonner";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "GratiSwag-Admin Dashboard",
  description: "Next.js 14 with Manrope font",
  icons: {
    icon: "/assets/fav.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased`}>
        <Providers>
        {children}
           <Toaster />
        </Providers>
      </body>
    </html>
  );
}
