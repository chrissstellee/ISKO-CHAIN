/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import CertificateModal from "@/components/modal/certificate-modal";
import DiplomaTemplate from "@/components/certificates/DiplomaTemplate";
import VerifiedSeal from "@/components/certificates/VerifiedSeal";
import { getTokenIdsForOwner, fetchCredentialMetadata } from "@/lib/fetchStudentNFTs";

export default function BlockchainWallet() {
  const { address } = useAccount();
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    if (!address) return;
    setLoading(true);

    // Base Sepolia RPC URL (QuickNode, public, etc)
    const provider = new ethers.JsonRpcProvider(
      "https://spring-few-bush.base-sepolia.quiknode.pro/0482e366e85f79ab64cd0afb9cf5691bf0607bb1/"
    );

    (async () => {
      try {
        const tokenIds = await getTokenIdsForOwner(address, provider);
        const creds = await Promise.all(
          tokenIds.map(async (tokenId) => {
            const meta = await fetchCredentialMetadata(tokenId, provider);
            return { ...meta, tokenId };
          })
        );
        setCredentials(creds);
      } catch (err) {
        setCredentials([]);
        console.error("Failed to fetch credentials", err);
      }
      setLoading(false);
    })();
  }, [address]);

  const verifiedCount = credentials.filter(c => (c.status ?? "verified").toLowerCase() === "verified").length;

  const getStatusChipClass = (status: string) => {
    switch ((status ?? "verified").toLowerCase()) {
      case "verified": return "chip success";
      case "invalid": return "chip error";
      default: return "chip default";
    }
  };

  if (!address) return <div>Please connect your wallet.</div>;
  if (loading) return <div>Loading credentials...</div>;
  if (credentials.length === 0) return <div>No credentials found for this wallet.</div>;

  return (
    <div className="card">
      <h2 className="card-title">My Blockchain Wallet</h2>

      <div className="wallet-credentials">
        <p className="wallet-title">Your Secure Credential Wallet</p>
        <div className="wallet-address">{address}</div>
        <div className="wallet-verified">{verifiedCount} Verified Credentials</div>
        {/* <div style={{ marginTop: 10 }}>
          <VerifiedSeal />
        </div> */}
      </div>

      <div className="student-table-container">
        <table className="activity-table">
          <thead>
            <tr>
              <th>Credential ID</th>
              <th>Type</th>
              <th>Issue Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {credentials.map((cred) => (
              <tr key={cred.tokenId}>
                <td>{cred.tokenId}</td>
                <td>{cred.credentialType || "—"}</td>
                <td>{cred.issueDate || "—"}</td>
                <td className="status-cell">
                  <span className={getStatusChipClass(cred.status)}>
                    {(cred.status ?? "Verified").charAt(0).toUpperCase() + (cred.status ?? "Verified").slice(1)}
                  </span>
                </td>
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

      {/* Certificate Modal (DiplomaTemplate) */}
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
