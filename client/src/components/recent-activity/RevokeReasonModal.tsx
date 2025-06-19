// RevokeReasonModal.tsx
import React, { FormEvent } from "react";
import { CredentialActivity } from "./types";

interface Props {
  open: boolean;
  submitting: boolean;
  credential?: CredentialActivity | null;
  reason: string;
  setReason: (v: string) => void;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
}

export default function RevokeReasonModal({
  open,
  submitting,
  credential,
  reason,
  setReason,
  onClose,
  onSubmit,
}: Props) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.25)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999,
    }}>
      <form
        onSubmit={onSubmit}
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: 28,
          minWidth: 340,
          maxWidth: 380,
          boxShadow: "0 8px 32px #0003",
          position: "relative"
        }}
      >
        <h3 style={{ marginBottom: 18, fontWeight: 600 }}>Revoke Credential</h3>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 500, marginBottom: 4, color: "#333" }}>Student</div>
          <div style={{ color: "#444", fontSize: 15, marginBottom: 2 }}>
            {credential?.firstName} {credential?.lastName} {credential?.studentId ? <span style={{ color: "#888" }}>({credential.studentId})</span> : null}
          </div>
          <div style={{ color: "#666", fontSize: 14 }}>
            {credential?.credentialType} — {credential?.credentialDetails}
          </div>
        </div>
        <label htmlFor="revokeReason" style={{ fontWeight: 500, marginBottom: 6, display: "block" }}>
          Reason for Revocation
        </label>
        <textarea
          id="revokeReason"
          required
          value={reason}
          disabled={submitting}
          onChange={e => setReason(e.target.value)}
          style={{
            width: "100%",
            borderRadius: 7,
            border: "1px solid #e0e0e0",
            padding: "9px 12px",
            minHeight: 65,
            fontSize: 15,
            marginBottom: 4,
            background: "#fafafa",
            color: "#222",
            resize: "vertical"
          }}
          placeholder="Enter revocation reason..."
        />
        <div style={{ marginTop: 18, display: "flex", gap: 14, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#eee", color: "#222", padding: "7px 18px", borderRadius: 8,
              border: "none", cursor: "pointer", fontWeight: 500
            }}
            disabled={submitting}
          >Cancel</button>
          <button
            type="submit"
            style={{
              background: "#b71c1c", color: "#fff", padding: "7px 18px", borderRadius: 8,
              border: "none", cursor: "pointer", fontWeight: 600,
              opacity: reason.trim() ? 1 : 0.55
            }}
            disabled={submitting || !reason.trim()}
          >{submitting ? "Revoking..." : "Revoke"}</button>
        </div>
      </form>
    </div>
  );
}
