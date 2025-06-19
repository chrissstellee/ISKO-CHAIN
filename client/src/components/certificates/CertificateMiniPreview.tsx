export default function CertificateMiniPreview({
  credential,
}: {
  credential: {
    firstName?: string;
    lastName?: string;
    credentialType?: string;
    credentialDetails?: string;
    issueDate?: string;
    credentialCode?: string;
  };
}) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 800,
        minWidth: 430,
        minHeight: 330,
        background: "linear-gradient(135deg, #fff8e1 0%, #ffe082 100%)",
        border: "2.5px solid #c0a13b",
        borderRadius: 16,
        boxShadow: "0 2px 8px #bfa14e22",
        padding: "22px 18px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "serif",
        transition: "box-shadow 0.2s",
      }}
    >
      <div style={{ fontWeight: 700, color: "#b08c00", fontSize: 16, marginBottom: 2, textAlign: "center" }}>
        {credential.credentialType || "Credential"}
      </div>
      <div style={{ fontWeight: 500, color: "#9e6800", fontSize: 15, marginBottom: 8, textAlign: "center" }}>
        {credential.credentialDetails || "—"}
      </div>
      <div style={{ color: "#674600", fontSize: 14, marginBottom: 2, textAlign: "center" }}>
        <span>
          {(credential.firstName || "First")} {(credential.lastName || "Last")}
        </span>
      </div>
      <div style={{ color: "#a7904b", fontSize: 13, textAlign: "center" }}>
        <b>Issued:</b> {credential.issueDate ? new Date(credential.issueDate).toLocaleDateString() : "—"}
      </div>
      <div style={{ color: "#baa344", fontSize: 12, textAlign: "center", marginTop: 5, wordBreak: "break-all" }}>
        <span style={{ fontSize: 11 }}>
          <b>Code:</b> {credential.credentialCode || "—"}
        </span>
      </div>
    </div>
  );
}
