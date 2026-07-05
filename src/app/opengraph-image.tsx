import { ImageResponse } from "next/og";
import { site } from "@/lib/site-metadata";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: site.themeColor,
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "64px",
          textAlign: "center",
          width: "100%"
        }}
      >
        <div
          style={{
            background: "#ffc250",
            borderRadius: 999,
            height: 96,
            marginBottom: 40,
            width: 96
          }}
        />
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            maxWidth: 900
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            color: "#ffc250",
            fontSize: 32,
            fontWeight: 600,
            marginTop: 24
          }}
        >
          {site.organization}
        </div>
        <div
          style={{
            color: "#d9e3f9",
            fontSize: 24,
            lineHeight: 1.4,
            marginTop: 28,
            maxWidth: 820
          }}
        >
          {site.description}
        </div>
      </div>
    ),
    size
  );
}
