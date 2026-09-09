import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { fontVariables } from "@/styles/fonts";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CursorProvider } from "@/components/cursor/CursorProvider";
import { Cursor } from "@/components/cursor/Cursor";
import { Nav } from "@/components/navigation/Nav";
import { SkipLink } from "@/components/a11y/SkipLink";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <SkipLink />
        <ViewTransitions>
          <SmoothScroll>
            <CursorProvider>
              <Cursor />
              <Nav />
              <main id="main">{children}</main>
            </CursorProvider>
          </SmoothScroll>
        </ViewTransitions>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
