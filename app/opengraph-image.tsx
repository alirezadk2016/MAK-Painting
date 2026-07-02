import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MAK Painting Group — 5★ Melbourne Painters";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const logoUrl = new URL("/logo.jpg", "https://www.makvandi.info").toString();

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background texture dots */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(201,162,75,0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            display: "flex",
          }}
        />

        {/* Gold accent top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #c9a24b, #e8c97a, #c9a24b)",
            display: "flex",
          }}
        />

        {/* Gold accent bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #c9a24b, #e8c97a, #c9a24b)",
            display: "flex",
          }}
        />

        {/* Left gold side accent */}
        <div
          style={{
            position: "absolute",
            top: 6,
            left: 0,
            width: 6,
            bottom: 6,
            background: "rgba(201,162,75,0.3)",
            display: "flex",
          }}
        />

        {/* Right gold side accent */}
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 0,
            width: 6,
            bottom: 6,
            background: "rgba(201,162,75,0.3)",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
            padding: "60px 80px",
          }}
        >
          {/* Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            width={120}
            height={120}
            style={{
              borderRadius: 24,
              border: "3px solid rgba(201,162,75,0.6)",
              objectFit: "cover",
            }}
            alt="MAK Painting Group logo"
          />

          {/* Company name */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div
              style={{
                color: "#c9a24b",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "4px",
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              MELBOURNE · VICTORIA · AUSTRALIA
            </div>

            <div
              style={{
                color: "#ffffff",
                fontSize: 56,
                fontWeight: 900,
                letterSpacing: "-1px",
                lineHeight: 1.1,
                textAlign: "center",
                display: "flex",
              }}
            >
              MAK Painting Group
            </div>
          </div>

          {/* Stars */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {"★★★★★".split("").map((star, i) => (
              <span
                key={i}
                style={{
                  color: "#c9a24b",
                  fontSize: 36,
                  lineHeight: 1,
                  display: "flex",
                }}
              >
                {star}
              </span>
            ))}
            <span
              style={{
                color: "#e8c97a",
                fontSize: 22,
                fontWeight: 700,
                marginLeft: 12,
                display: "flex",
              }}
            >
              5.0 · 7 Google Reviews
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 22,
              fontWeight: 400,
              textAlign: "center",
              maxWidth: 700,
              lineHeight: 1.5,
              display: "flex",
            }}
          >
            Interior · Exterior · Roof · Commercial · Special Finishes
          </div>

          {/* Domain badge */}
          <div
            style={{
              background: "rgba(201,162,75,0.15)",
              border: "1px solid rgba(201,162,75,0.4)",
              borderRadius: 50,
              padding: "10px 28px",
              color: "#c9a24b",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "1px",
              display: "flex",
            }}
          >
            makvandi.info
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
