/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ethers } from "ethers";
import IskoChainCredentialABI from "@/lib/IskoChainCredential.json";
import "@/styles/card.css";
import "@/styles/text.css";
import "@/styles/button.css";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS!;
const PROVIDER_URL = "https://chaotic-hidden-field.base-sepolia.quiknode.pro/dfae31e97baf6393177d11cc5100b7e00bda47b4/"; // Replace with your own

export default function Verification() {
  const [credentialId, setCredentialId] = useState('');
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<"idle"|"loading"|"verified"|"invalid">( "idle" );
  const [credential, setCredential] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQrImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Simulate, or connect with a QR library to extract the credential ID
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setQrImage(objectUrl);
      // setVerificationStatus("verified");
    }
  };

  // MAIN: Actual blockchain verification
  const handleVerify = async () => {
    setVerificationStatus("loading");
    setCredential(null);
    setError(null);

    try {
      const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, IskoChainCredentialABI, provider);

      // 1. Try to get tokenURI to check if credential exists (not burned)
      let tokenURI: string;
      try {
        tokenURI = await contract.tokenURI(Number(credentialId));
      } catch (err) {
        setVerificationStatus("invalid");
        setError("Credential not found or has been revoked.");
        return;
      }

      // 2. Fetch metadata from Pinata/IPFS
      const metadataUrl = tokenURI.startsWith("ipfs://")
        ? tokenURI.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
        : tokenURI;

      const res = await fetch(metadataUrl);
      if (!res.ok) {
        setVerificationStatus("invalid");
        setError("Failed to fetch credential metadata.");
        return;
      }
      const meta = await res.json();

      setCredential(meta);
      setVerificationStatus("verified");
    } catch (err: any) {
      setVerificationStatus("invalid");
      setError("Unexpected error. " + (err?.message || ""));
    }
  };

  const handleRefresh = () => {
    setCredentialId('');
    setQrImage(null);
    setVerificationStatus("idle");
    setCredential(null);
    setError(null);
  };

  return (
    <div>
      <h2 className="card-title">Verification Method</h2>
      <Tabs defaultValue="id" className="w-full">
        <TabsList>
          <TabsTrigger value="id">ID Lookup</TabsTrigger>
          <TabsTrigger value="qr">QR Code</TabsTrigger>
        </TabsList>

        {/* ID Verification Tab */}
        <TabsContent value="id">
          <button className="refresh-button" onClick={handleRefresh}>⟳ Refresh</button>
          <div className="verification-input-group">
            <input
              type="text"
              placeholder="Enter credential ID or tokenId..."
              className="identifier-input-field"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              disabled={verificationStatus === "loading"}
            />
            <button className="verify-button" onClick={handleVerify} disabled={!credentialId || verificationStatus === "loading"}>
              {verificationStatus === "loading" ? "Verifying..." : "Verify"}
            </button>
          </div>
        </TabsContent>

        {/* QR Verification Tab */}
        <TabsContent value="qr">
          <button className="refresh-button" onClick={handleRefresh}>⟳ Refresh</button>
          <div className="qr-code-box">
            {!qrImage ? (
              <>
                <p className="qr-code-title">Choose how to scan the QR Code:</p>
                <div className="qr-code-actions">
                  <button className="camera-button">Use Camera</button>
                  <label className="upload-label">
                    Upload QR Code Image
                    <input type="file" accept="image/*" onChange={handleQrImageUpload} />
                  </label>
                </div>
              </>
            ) : (
              <div className="qr-preview-wrapper" style={{ flexDirection: 'column' }}>
                <img src={qrImage} alt="QR Preview" className="qr-preview" />
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                  <label className="upload-label">
                    Upload Another
                    <input type="file" accept="image/*" onChange={handleQrImageUpload} />
                  </label>
                  <button className="camera-button" onClick={handleRefresh}>Remove</button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Result Display */}
      {verificationStatus === 'verified' && credential && (
        <div className="verification-result">
          <p className="result-title">Credential Successfully Verified!</p>
          <p className="result-subtext">This credential has been cryptographically verified on the blockchain.</p>
        </div>
      )}

      {verificationStatus === 'invalid' && (
        <div className="verification-invalid">
          <div className="check-icon"><i className="ri-close-line"></i></div>
          <p className="invalid-title">Credential is Invalid!</p>
          <p className="result-subtext">{error || "This credential is invalid or revoked."}</p>
        </div>
      )}
    </div>
  );
}
