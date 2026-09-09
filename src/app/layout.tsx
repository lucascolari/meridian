import "./globals.css";
import type { ReactNode } from "react";
import { fontVariables } from "@/styles/fonts";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
