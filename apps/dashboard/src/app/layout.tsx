import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "gBlockParty",
  description: "Personal deployment platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
          <nav className="border-b bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">gBlockParty</h1>
            </div>
          </nav>
          <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
