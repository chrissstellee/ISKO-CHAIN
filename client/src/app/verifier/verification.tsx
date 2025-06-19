 
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { createClient, gql } from "urql";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cacheExchange, fetchExchange } from "@urql/core";
import "@/styles/card.css";
import "@/styles/text.css";
import "@/styles/button.css";

const SUBGRAPH_URL = "https://api.studio.thegraph.com/query/113934/isko-chain/version/latest";
const client = createClient({
  url: SUBGRAPH_URL,
  exchanges: [cacheExchange, fetchExchange],
});

const CREDENTIAL_QUERY = gql`
  query CredentialByCode($credentialCode: String!) {
    credentials(where: { credentialCode: $credentialCode }) {
      credentialCode
      credentialType
      credentialDetails
      firstName
      lastName
      issueDate
      issuer
      program
      tokenId
      owner
      status
    }
  }
`;

const CREDENTIAL_BY_TOKENID_QUERY = gql`
  query CredentialByTokenId($tokenId: BigInt!) {
    credentials(where: { tokenId: $tokenId }) {
      credentialCode
      credentialType
      credentialDetails
      firstName
      lastName
      issueDate
      issuer
      program
      tokenId
      owner
      status
    }
  }
`;

const TRANSFER_QUERY = gql`
  query TransferByTokenId($tokenId: BigInt!) {
    transfers(where: { tokenId: $tokenId }, orderBy: blockNumber, orderDirection: asc, first: 1) {
      tokenId
      from
      to
      blockNumber
      transactionHash
    }
  }
`;

interface VerificationProps {
  setCredential: (cred: any) => void;
  setTransfer: (transfer: any) => void;
  tokenIdFromUrl?: string | null;
}

export default function Verification({ setCredential, setTransfer, tokenIdFromUrl }: VerificationProps) {
  const [credentialCode, setCredentialCode] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "loading" | "verified" | "invalid">("idle");
  const [error, setError] = useState<string | null>(null);

  // Auto-verify if tokenId is in the URL
  useEffect(() => {
    if (tokenIdFromUrl) {
      handleVerifyByTokenId(tokenIdFromUrl);
    }
    // eslint-disable-next-line
  }, [tokenIdFromUrl]);

  // Handler: verify by credentialCode
  const handleVerify = async () => {
    setVerificationStatus("loading");
    setError(null);
    setCredential(null);
    setTransfer(null);

    const { data } = await client.query(CREDENTIAL_QUERY, { credentialCode }).toPromise();
    const cred = data?.credentials?.[0];

    if (!cred) {
      setVerificationStatus("invalid");
      setError("Credential not found.");
      return;
    }

    // Check for revoked/reissued status
    const status = cred.status?.toLowerCase();
    if (status === "revoked" || status === "reissued") {
      setVerificationStatus("invalid");
      setCredential(cred); // You may set to null if you want to hide details
      setError(
        status === "revoked"
          ? "This credential has been revoked and is no longer valid."
          : "This credential has been reissued and is no longer valid."
      );
      return;
    }

    setCredential(cred);

    // Query transfer info by tokenId
    const { data: tData } = await client.query(TRANSFER_QUERY, { tokenId: cred.tokenId }).toPromise();
    const transfer = tData?.transfers?.[0] || null;
    setTransfer(transfer);

    setVerificationStatus("verified");
  };

  // Handler: verify by tokenId (from URL)
  const handleVerifyByTokenId = async (tokenId: string) => {
    setVerificationStatus("loading");
    setError(null);
    setCredential(null);
    setTransfer(null);

    const { data } = await client.query(CREDENTIAL_BY_TOKENID_QUERY, { tokenId }).toPromise();
    const cred = data?.credentials?.[0];

    if (!cred) {
      setVerificationStatus("invalid");
      setError("Credential not found.");
      return;
    }

    // Check for revoked/reissued status
    const status = cred.status?.toLowerCase();
    if (status === "revoked" || status === "reissued") {
      setVerificationStatus("invalid");
      setCredential(cred); // You may set to null if you want to hide details
      setError(
        status === "revoked"
          ? "This credential has been revoked and is no longer valid."
          : "This credential has been reissued and is no longer valid."
      );
      return;
    }

    setCredential(cred);

    // Query transfer info by tokenId
    const { data: tData } = await client.query(TRANSFER_QUERY, { tokenId }).toPromise();
    const transfer = tData?.transfers?.[0] || null;
    setTransfer(transfer);

    setVerificationStatus("verified");
  };

  const handleRefresh = () => {
    setCredentialCode("");
    setVerificationStatus("idle");
    setError(null);
    setCredential(null);
    setTransfer(null);
  };

  return (
    <div>
      <h2 className="card-title">Verification Method</h2>
      <Tabs defaultValue="id" className="w-full">
        <TabsList>
          <TabsTrigger value="id">Credential Code Lookup</TabsTrigger>
        </TabsList>

        {/* ID Verification Tab */}
        <TabsContent value="id">
          <button className="refresh-button" onClick={handleRefresh}>⟳ Refresh</button>
          <div className="verification-input-group">
            <input
              type="text"
              placeholder="Enter credential code..."
              className="identifier-input-field"
              value={credentialCode}
              onChange={(e) => setCredentialCode(e.target.value)}
              disabled={verificationStatus === "loading"}
            />
            <button
              className="verify-button"
              onClick={handleVerify}
              disabled={!credentialCode || verificationStatus === "loading"}
            >
              {verificationStatus === "loading" ? "Verifying..." : "Verify"}
            </button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Result Display */}
      {verificationStatus === "verified" && (
        <div className="verification-result">
          <p className="result-title">Credential Successfully Verified!</p>
          <p className="result-subtext">
            This credential has been cryptographically verified on the blockchain.
          </p>
        </div>
      )}

      {verificationStatus === "invalid" && (
        <div className="verification-invalid">
          <div className="check-icon"><i className="ri-close-line"></i></div>
          <p className="invalid-title">Credential is Invalid!</p>
          <p className="result-subtext">{error || "This credential is invalid or revoked."}</p>
        </div>
      )}
    </div>
  );
}
