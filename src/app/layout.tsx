import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lighting ERP",
  description: "Terracotta Designs and Kanova shared ERP"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
