import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "gBlockParty",
  description: "Every piece of content and code is a gBlock.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
