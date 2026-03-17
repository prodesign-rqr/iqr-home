import type { Metadata } from "next";
import "./globals.css";
 
export const metadata: Metadata = {
  title: "IQR HOME!",
  description: "A property telemetry layer that helps a house explain itself."
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
