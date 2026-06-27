import { ImageResponse } from "@vercel/og"

export const runtime = "edge"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get("title") || "Vaibhav Sharma"
    const subtitle =
      searchParams.get("subtitle") || "AI Agent Infrastructure & Full-Stack Systems Engineer"

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            backgroundColor: "#0A0D12",
            backgroundImage: "radial-gradient(circle at 50% 50%, #141920 0%, #0A0D12 100%)",
            padding: "80px",
            fontFamily: "sans-serif",
            position: "relative",
          }}
        >
          {/* Top accent line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "8px",
              backgroundColor: "#4DA3FF",
            }}
          />

          {/* Network grid background node representation */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: "60px",
              right: "80px",
              fontSize: "12px",
              color: "rgba(77, 163, 255, 0.15)",
              fontFamily: "monospace",
              border: "1px solid rgba(77, 163, 255, 0.15)",
              padding: "8px 12px",
              borderRadius: "4px",
            }}
          >
            SYSTEMS NODE: ACTIVE
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#4DA3FF",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "24px",
              fontFamily: "monospace",
            }}
          >
            ENGINEER PORTFOLIO // MISSION CONTROL
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "64px",
              fontWeight: "bold",
              color: "#F9FAFB",
              lineHeight: 1.15,
              marginBottom: "20px",
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "26px",
              color: "#94A3B8",
              lineHeight: 1.45,
              maxWidth: "850px",
              marginBottom: "40px",
            }}
          >
            {subtitle}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
              color: "#22C55E",
              fontFamily: "monospace",
              fontWeight: "bold",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#22C55E",
                marginRight: "8px",
              }}
            />
            STATUS: AVAILABLE — OPEN TO FULL-TIME ROLES
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
