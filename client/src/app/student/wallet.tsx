/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { createClient, gql } from "urql";
import CertificateModal from "@/components/modal/certificate-modal";
import DiplomaTemplate from "@/components/certificates/DiplomaTemplate";
import { cacheExchange, fetchExchange } from "@urql/core";
import "@/styles/card.css";
import "@/styles/table.css";

const SUBGRAPH_URL = "https://api.studio.thegraph.com/query/113934/isko-chain/version/latest";
const client = createClient({
  url: SUBGRAPH_URL,
  exchanges: [cacheExchange, fetchExchange],
});

const CREDENTIALS_QUERY = gql`
  query CredentialsByOwner($owner: Bytes!) {
    credentials(where: { owner: $owner }, orderBy: createdAt, orderDirection: desc) {
      credentialCode
      credentialType
      credentialDetails
      firstName
      lastName
      issueDate
      tokenId
      tokenURI
      owner
    }
  }
`;

export default function StudentWallet() {
  const { address } = useAccount();
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    if (!address) return;
    setLoading(true);

    client
      .query(CREDENTIALS_QUERY, { owner: address.toLowerCase() })
      .toPromise()
      .then((result) => {
        setCredentials(result.data?.credentials || []);
      })
      .catch((err) => {
        setCredentials([]);
        console.error("Failed to fetch credentials", err);
      })
      .finally(() => setLoading(false));
  }, [address]);

  if (!address) return <div>Please connect your wallet.</div>;
  if (loading) return <div>Loading credentials...</div>;
  if (credentials.length === 0) return <div>No credentials found for this wallet.</div>;

  return (
    <div className="card">
      <h2 className="card-title">My Blockchain Wallet</h2>

      <div className="wallet-credentials">
        <p className="wallet-title">Your Secure Credential Wallet</p>
        <div className="wallet-address">{address}</div>
        <div className="wallet-verified">{credentials.length} Verified Credentials</div>
        {/* <div style={{ marginTop: 10 }}>
          <VerifiedSeal />
        </div> */}
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
