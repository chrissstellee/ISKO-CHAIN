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
    // Add any other meta fields here!
  };
}) {
  return (
    <div
      style={{
        width: 600,
        margin: "0 auto",
        padding: 40,
        background: "linear-gradient(135deg, #fff8dc 0%, #ffe0b2 100%)",
        border: "4px solid #bfa14e",
        borderRadius: 24,
        boxShadow: "0 8px 32px #0002",
        fontFamily: "'Georgia', serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Image
        src="/pup_holographic_seal.gif"
        alt="PUP Holographic Seal"
        width={125}
        height={125}
        style={{
          position: "absolute",
          bottom: 32,
          left: 32,
          opacity: 0.88,
          pointerEvents: "none",
          zIndex: 2,
          borderRadius: "50%",
          boxShadow: "0 2px 18px #bfa14e55",
          background: "#fffdf3",
        }}
        draggable={false}
        priority
      />

      <h2
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: 32,
          color: "#713c00",
          textAlign: "center",
          marginBottom: 10,
        }}
      >
        Polytechnic University of the Philippines
      </h2>
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 18,
          color: "#914300",
        }}
      >
        <span>Official Certificate</span>
      </div>
      <div
        style={{
          margin: "38px 0 16px 0",
          textAlign: "center",
          fontSize: 22,
          color: "#653b14",
        }}
      >
        This certifies that
        <br />
        <span style={{ fontWeight: 700, fontSize: 28 }}>
          {(credential.firstName || "Student") + " " + (credential.lastName || "Student")}
        </span>
        <br />
        has been awarded:
      </div>
      <div
        style={{
          textAlign: "center",
          color: "#b79c47",
          fontWeight: 700,
          fontSize: 26,
          margin: "20px 0",
        }}
      >
        {credential.credentialDetails || "Credential Title"}
      </div>
      <div
        style={{
          textAlign: "center",
          color: "#7d5b26",
          fontSize: 19,
        }}
      >
        Type: {credential.credentialType}
      </div>
      <div
        style={{
          marginTop: 24,
          textAlign: "center",
          color: "#7d5b26",
        }}
      >
        <b>Date Issued:</b>{" "}
        {credential.issueDate
          ? new Date(credential.issueDate).toLocaleDateString()
          : ""}
      </div>
      <div
        style={{
          marginTop: 60,
          textAlign: "right",
          color: "#bfa14e",
          fontSize: 15,
        }}
      >
        <b>Credential Code:</b> {credential.credentialCode ?? ""}
      </div>
    </div>
  );
}
