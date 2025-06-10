'use client';

export default function VerifiedSeal() {
  return (
    <div style={{
      display: "inline-block",
      position: "relative",
      width: 90,
      height: 90,
      margin: "0 auto"
    }}>
      {/* Animated Circle */}
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle
          cx="45" cy="45" r="40"
          fill="#fff"
          stroke="#388e3c"
          strokeWidth="5"
          style={{
            strokeDasharray: 251,
            strokeDashoffset: 0,
            animation: "spin 2s linear infinite"
          }}
        />
        {/* Checkmark */}
        <polyline
          points="30,48 43,60 62,35"
          fill="none"
          stroke="#388e3c"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 40,
            strokeDashoffset: 0,
            animation: "drawCheck 0.7s 1s ease forwards"
          }}
        />
      </svg>
      {/* Style tag for CSS keyframes */}
      <style jsx>{`
        @keyframes spin {
          0%   { stroke-dashoffset: 251; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes drawCheck {
          0%   { stroke-dashoffset: 40; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
      {/* Text under the seal */}
      <div style={{
        position: "absolute",
        bottom: -30,
        left: "50%",
        transform: "translateX(-50%)",
        color: "#388e3c",
        fontWeight: 700,
        fontSize: 16,
        textShadow: "0 2px 8px #fff"
      }}>
        VERIFIED
      </div>
    </div>
  );
}
