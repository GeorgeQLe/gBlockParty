import type { Metadata } from "next";
import Script from "next/script";
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
      <body>
          {children}
          {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
            <Script
              src="https://plausible.io/js/script.js"
              data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
              strategy="afterInteractive"
            />
          )}
        </body>
    </html>
  );
}
