/* eslint-disable @typescript-eslint/no-explicit-any */
// client/src/app/student/wallet.tsx
"use client";
import { useState } from "react";
import CertificateModal from "@/components/modal/certificate-modal";
import DiplomaTemplate from "@/components/certificates/DiplomaTemplate";
import "@/styles/card.css";
import "@/styles/table.css";

interface Credential {
  tokenId: string;
  owner?: string;
  credentialCode?: string;
  credentialType?: string;
  credentialDetails?: string;
  issueDate?: string;
  // add other fields as needed
}

interface StudentWalletProps {
  credentials: Credential[];
  loading: boolean;
}

export default function StudentWallet({ credentials, loading }: StudentWalletProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  if (loading) return <div>Loading credentials...</div>;
  if (!credentials || credentials.length === 0)
    return <div>No credentials found for this wallet.</div>;

  // Use the owner address from the first credential for display
  const address = credentials[0]?.owner;

  return (
    <div className="card">
      <h2 className="card-title">My Blockchain Wallet</h2>

      <div className="wallet-credentials">
        <p className="wallet-title">Your Secure Credential Wallet</p>
        <div className="wallet-address">{address}</div>
        <div className="wallet-verified">{credentials.length} Verified Credentials</div>
      </div>
      <h2 className="card-title">My Credentials</h2>
      <div className="student-table-container">
        <table className="activity-table">
          <thead>
            <tr>
              <th>Credential Code</th>
              <th>Type</th>
              <th>Details</th>
              <th>Issue Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {credentials.map((cred) => (
              <tr key={cred.tokenId}>
                <td>{cred.credentialCode || cred.tokenId}</td>
                <td>{cred.credentialType || "—"}</td>
                <td>{cred.credentialDetails || "—"}</td>
                <td>{cred.issueDate || "—"}</td>
                <td>
                  <button
                    className="view-button"
                    onClick={() => {
                      setSelected(cred);
                      setModalOpen(true);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal for viewing certificate details */}
      <CertificateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        certificateContent={
          selected ? <DiplomaTemplate credential={selected} /> : null
        }
      />
    </div>
  );
}
