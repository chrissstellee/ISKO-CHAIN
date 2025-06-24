import React, { FormEvent, useEffect } from "react";
import { CredentialActivity } from "./types";

interface Props {
  open: boolean;
  submitting: boolean;
  form: Partial<CredentialActivity>;
  setForm: React.Dispatch<React.SetStateAction<Partial<CredentialActivity>>>;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
}

export default function ReissueModal({
  open,
  submitting,
  form,
  setForm,
  onClose,
  onSubmit,
}: Props) {
  // Auto-set issueDate on modal open if not already set
  useEffect(() => {
    if (open) {
      const today = new Date().toISOString().slice(0, 10);
      setForm(f => ({ ...f, issueDate: today }));
    }
    // Only run when modal is opened
    // eslint-disable-next-line
  }, [open]);

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
          boxShadow: "0 8px 32px #0003",
          position: "relative"
        }}
      >
        <h3 style={{ marginBottom: 14 }}>Reissue Credential</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label htmlFor="credentialType">Credential Type</label>
          <select
            id="credentialType"
            value={form.credentialType || ""}
            onChange={e => setForm(f => ({ ...f, credentialType: e.target.value }))}
            required
            style={{ width: "100%", borderRadius: 6, border: "1px solid #ddd", padding: 6 }}
          >
            <option value="">-- Select Type --</option>
            <option value="Degree Certificate">Degree Certificate</option>
            <option value="Course Completion">Course Completion</option>
            <option value="Honor/Award">Honor/Award</option>
            <option value="Workshop Certificate">Workshop Certificate</option>
          </select>
          <label>
            Credential Details
            <input
              value={form.credentialDetails || ""}
              onChange={e => setForm((f) => ({ ...f, credentialDetails: e.target.value }))}
              required
              style={{ width: "100%", borderRadius: 6, border: "1px solid #ddd", padding: 6 }}
            />
          </label>
          <label>
            Additional Metadata
            <input
              value={form.additionalInfo || ""}
              onChange={e => setForm((f) => ({ ...f, additionalInfo: e.target.value }))}
              style={{ width: "100%", borderRadius: 6, border: "1px solid #ddd", padding: 6 }}
              placeholder="Optional"
            />
          </label>
        </div>
        <div style={{ marginTop: 16, display: "flex", gap: 12, justifyContent: "flex-end" }}>
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
              background: "#388e3c", color: "#fff", padding: "7px 18px", borderRadius: 8,
              border: "none", cursor: "pointer", fontWeight: 600
            }}
            disabled={submitting}
          >Reissue</button>
        </div>
      </form>
    </div>
  );
}
