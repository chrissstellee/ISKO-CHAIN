/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { fetchCredentialsAndTransfers } from "@/lib/fetchStudentNFTs";
import { useAccount } from "wagmi";

export default function StudentCredentials() {
  const { address } = useAccount();
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    fetchCredentialsAndTransfers(address)
      .then((result) => setCredentials(result.credentials || []))
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
      <h2 className="card-title">My Credentials</h2>
      {credentials.map((cred, idx) => (
        <div className="student-credential-box" key={idx}>
          <div className="student-credential-info">
            <div>
              <h3 className="student-credential-title">{cred.credentialDetails || "Untitled"}</h3>
              <p className="student-credential-meta">
                Type: {cred.credentialType || "Unknown"}
                <br />
                Issued: {cred.issueDate}
                <br />
                Credential Code: {cred.credentialCode}
                <br />
                Token ID: {cred.tokenId}
              </p>
              <p className="student-verified-text">✓ Blockchain Verified</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
