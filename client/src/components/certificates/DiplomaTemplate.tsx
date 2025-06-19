/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
// components/certificates/DiplomaTemplate.tsx
import Image from "next/image";

export default function DiplomaTemplate({
  credential,
}: {
  credential: {
    credentialDetails: string;
    credentialType: string;
    studentId: string;
    issueDate: string;
    firstName: string;
    lastName: string;
    credentialCode: string;
    additionalInfo?: string; // Optional field for any extra info
    // Add any other meta fields here!
  };
}) {
  const isCourseCompletion =
    credential.credentialType?.toLowerCase() === "course completion";

  // Signature data: always show Head, Office and Campus Director. Professor is conditional.
  const signatures = [
    isCourseCompletion && {
      name: "Rosicar E. Escober, Ph.D.",
      title: "Professor",
    },
    {
      name: "Demelyn E. Monzon, Ph. D",
      title: "Head, Office of Academic Programs",
    },
    {
      name: "Jaime P. Gutierrez, Jr.",
      title: "Campus Director",
    },
  ].filter(Boolean); // Remove undefined if professor is hidden

  return (
    <div
      style={{
        width: 575,
        margin: "0 auto",
        padding: 0,
        background: "linear-gradient(135deg, #f8f6f0 0%, #fff8e7 50%, #f5f1e8 100%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Times New Roman', 'Georgia', serif",
        boxShadow: "0 12px 48px rgba(0,0,0,0.15)",
      }}
    >
      {/* Decorative corners */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, width: 90, height: 90,
        background: "linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)",
        clipPath: "polygon(0 0, 100% 0, 0 100%)", zIndex: 1,
      }} />
      <div style={{
        position: "absolute",
        top: 0, right: 0, width: 90, height: 90,
        background: "linear-gradient(225deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)",
        clipPath: "polygon(100% 0, 100% 100%, 0 0)", zIndex: 1,
      }} />
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, width: 90, height: 90,
        background: "linear-gradient(45deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)",
        clipPath: "polygon(0 0, 100% 100%, 0 100%)", zIndex: 1,
      }} />
      <div style={{
        position: "absolute",
        bottom: 0, right: 0, width: 90, height: 90,
        background: "linear-gradient(315deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)",
        clipPath: "polygon(100% 0, 100% 100%, 0 100%)", zIndex: 1,
      }} />

      {/* Borders */}
      <div style={{
        position: "absolute",
        top: 12, left: 12, right: 12, bottom: 12,
        border: "2px solid #d4af37",
        borderRadius: 6,
        zIndex: 1,
      }} />
      <div style={{
        position: "absolute",
        top: 20, left: 20, right: 20, bottom: 20,
        border: "1px solid #e6c857",
        borderRadius: 3,
        zIndex: 1,
      }} />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "42px 57px",
          textAlign: "center",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 21,
          }}
        >
          <div style={{
            width: 40, height: 60, borderRadius: "50%",
            background: "linear-gradient(135deg, #8b0000 0%, #a52a2a 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #d4af37",
            fontSize: 10, color: "white", fontWeight: "bold",
          }}>
            PUP<br />1904
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <h1
              style={{
                fontSize: 18, fontWeight: "bold", color: "#2c1810",
                margin: 0, letterSpacing: 1.5, textTransform: "uppercase",
              }}
            >
              Polytechnic University of the Philippines
            </h1>
            <div
              style={{
                fontSize: 12,
                color: "#2c1810",
                fontWeight: "bold",
                marginTop: 4,
                letterSpacing: 0.8,
              }}
            >
              QUEZON CITY CAMPUS
            </div>
          </div>
        </div>

        {/* Award this */}
        <div
          style={{
            fontSize: 14,
            color: "#b8860b",
            fontStyle: "italic",
            marginBottom: 15,
          }}
        >
          award this
        </div>

        {/* Certificate title */}
        <h2
          style={{
            fontSize: 36,
            fontWeight: "bold",
            color: "#d4af37",
            margin: "15px 0",
            textTransform: "uppercase",
            letterSpacing: 2,
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Certificate of Authenticity
        </h2>

        {/* Decorative line */}
        <div
          style={{
            height: 2,
            background: "linear-gradient(90deg, transparent 0%, #d4af37 50%, transparent 100%)",
            margin: "22px auto",
            width: 285,
          }}
        />

        {/* To text */}
        <div
          style={{
            fontSize: 14,
            color: "#8b4513",
            marginBottom: 12,
          }}
        >
          to
        </div>

        {/* Recipient name */}
        <h3
          style={{
            fontSize: 27,
            fontWeight: "bold",
            color: "#8b0000",
            margin: "15px 0",
            textTransform: "uppercase",
            letterSpacing: 1.5,
          }}
        >
          {(credential.firstName || "Student") + " " + (credential.lastName || "Student")}
        </h3>

        {/* Recognition text */}
        <div
          style={{
            fontSize: 12,
            color: "#2c1810",
            lineHeight: 1.6,
            margin: "22px 0",
            maxWidth: 450,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          is hereby awarded this certificate in recognition of{" "}
          <strong>{credential.credentialDetails}</strong>
          <br />
          for fulfilling the requirements and demonstrating excellence in the pursuit of the
          <br />
          <strong>"{credential.credentialType || "Professional Development and Excellence"}"</strong>
        </div>

        {/* Date and location */}
        <div
          style={{
            fontSize: 11,
            color: "#2c1810",
            margin: "30px 0",
          }}
        >
          Issued this{" "}
          {credential.issueDate
            ? new Date(credential.issueDate).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "_____ day of ______, 2025"}
        </div>

        {/* Signatures (all centered, vertical stack) */}
        <div style={{ marginTop: 45 }}>
          {signatures.map((sig: any, idx: number) => (
            <div key={idx} style={{ textAlign: "center", marginBottom: 24 }}>
              <div
                style={{
                  height: 30,
                  borderBottom: "1px solid #2c1810",
                  marginBottom: 6,
                  position: "relative",
                  width: 180,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: 4,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontStyle: "italic",
                    fontSize: 14,
                    color: "#8b4513",
                  }}
                >
                  [Signature]
                </div>
              </div>
              <div style={{ fontWeight: "bold", fontSize: 11 }}>{sig.name}</div>
              <div>{sig.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Holographic seal */}
      <Image
        src="/pup_holographic_seal.gif"
        alt="PUP Holographic Seal"
        width={75}
        height={75}
        style={{
          position: "absolute",
          top: 40,
          left: 45,
          opacity: 0.9,
          pointerEvents: "none",
          zIndex: 3,
          borderRadius: "50%",
          boxShadow: "0 4px 20px rgba(212, 175, 55, 0.3)",
          background: "rgba(255, 255, 255, 0.9)",
          border: "2px solid #d4af37",
        }}
        draggable={false}
        priority
      />

      {/* Credential code */}
      <div
        style={{
          position: "absolute",
          bottom: 15,
          right: 30,
          fontSize: 8,
          color: "#8b4513",
          zIndex: 3,
        }}
      >
        <strong>Credential Code:</strong>{" "}
        {credential.credentialCode ?? "PUP-CERT-2024-001"}
      </div>
    </div>
  );
}
