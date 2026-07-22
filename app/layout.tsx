import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Room Design Assistant",
  description: "Generate room design ideas in the browser.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
