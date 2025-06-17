/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from '@/components/navbar';
import CredentialDetails from "@/app/verifier/credential-details";
import Verification from "@/app/verifier/verification";
import '@/styles/verifier.css';

export default function VerifierClient() {
  const [credential, setCredential] = useState<any | null>(null);
  const [transfer, setTransfer] = useState<any | null>(null);

  // Get tokenId from query params
  const searchParams = useSearchParams();
  const tokenIdFromUrl = searchParams.get("tokenId");

  return (
    <div>
      <Navbar />
      <div className="screen-container">
        <h1 className="page-title">Verify Academic Credentials</h1>
        <div className="card">
          {/* Pass down tokenIdFromUrl */}
          <Verification
            setCredential={setCredential}
            setTransfer={setTransfer}
            tokenIdFromUrl={tokenIdFromUrl}
          />
        </div>
        <CredentialDetails credential={credential} transfer={transfer} />
      </div>
    </div>
  );
}
