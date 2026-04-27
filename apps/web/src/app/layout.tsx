import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gblockparty.com"),
  title: "gBlockParty",
  description: "Every piece of content and code is a gBlock.",
  openGraph: {
    type: "website",
    siteName: "gBlockParty",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
