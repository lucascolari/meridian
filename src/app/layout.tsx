import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import { fontVariables } from "@/styles/fonts";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CursorProvider } from "@/components/cursor/CursorProvider";
import { Cursor } from "@/components/cursor/Cursor";
import { Nav } from "@/components/navigation/Nav";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <ViewTransitions>
          <SmoothScroll>
            <CursorProvider>
              <Cursor />
              <Nav />
              {children}
            </CursorProvider>
          </SmoothScroll>
        </ViewTransitions>
      </body>
    </html>
  );
}
