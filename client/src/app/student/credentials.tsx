/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { getTokenIdsForOwner, fetchCredentialMetadata } from "@/lib/fetchStudentNFTs";
import VerifiedSeal from "@/components/certificates/VerifiedSeal";

export default function StudentCredentials() {
  const { address } = useAccount();
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    const provider = new ethers.JsonRpcProvider(
      "https://chaotic-hidden-field.base-sepolia.quiknode.pro/dfae31e97baf6393177d11cc5100b7e00bda47b4/"
    );
    (async () => {
      try {
        const tokenIds = await getTokenIdsForOwner(address, provider);
        const creds = await Promise.all(
          tokenIds.map(async (tokenId) => {
            try {
              const meta = await fetchCredentialMetadata(tokenId, provider);
              return { ...meta, tokenId };
            } catch {
              return null; // skip burned/invalid
            }
          })
        );
        setCredentials(creds.filter(Boolean));
      } catch (err) {
        setCredentials([]);
        console.error("Failed to fetch credentials", err);
      }
      setLoading(false);
    })();
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
                Token ID: {cred.tokenId}
              </p>
              <VerifiedSeal />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
