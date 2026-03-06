export default function Logo({ size = "default", centered = false }) {
  const iconConfig = {
    large: { width: 56, height: 56, fontSize: "1.5rem", borderRadius: 14 },
    small: { width: 30, height: 30, fontSize: "0.9rem", borderRadius: 8 },
    default: { width: 40, height: 40, fontSize: "1.1rem", borderRadius: 10 },
  };

  const textSizeMap = {
    large: "1.8rem",
    small: "1.1rem",
    default: "1.3rem",
  };

  const icon = iconConfig[size] || iconConfig.default;
  const textSize = textSizeMap[size] || textSizeMap.default;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        justifyContent: centered ? "center" : "flex-start",
      }}
    >
      <div
        style={{
          width: icon.width,
          height: icon.height,
          background: "var(--accent)",
          borderRadius: icon.borderRadius,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: icon.fontSize,
          color: "#fff",
          flexShrink: 0,
        }}
      >
        ▶
      </div>
      <span
        style={{
          fontSize: textSize,
          fontWeight: 800,
          color: "var(--text)",
          letterSpacing: "-0.03em",
        }}
      >
        MeetYouLive
      </span>
    </div>
  );
}
