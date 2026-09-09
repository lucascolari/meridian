import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "MERIDIAN — creative studio";
// Requerido con output: export (GitHub Pages) para generar la imagen OG estática.
export const dynamic = "force-static";

const INK = "#0a0a0a";
const GOLD = "#d9a441";

export default async function OpengraphImage() {
  const site = getSiteSettings();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: INK,
          color: "#f5f5f0",
          padding: "80px",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "3px",
            backgroundColor: GOLD,
            marginBottom: "40px",
          }}
        />
        <div
          style={{
            fontSize: "128px",
            fontFamily: "serif",
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            marginTop: "32px",
            fontSize: "36px",
            color: GOLD,
            letterSpacing: "0.02em",
          }}
        >
          {site.tagline}
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
