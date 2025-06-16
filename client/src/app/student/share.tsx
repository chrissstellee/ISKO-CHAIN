// client/src/app/student/share.tsx
"use client"
import React, { useState } from 'react';
import QRCodeModal from '@/components/modal/student-qr';

type Credential = {
  tokenId: string;
  credentialType?: string;
  credentialCode?: string;
  // Add other fields if needed
};

interface ShareCredentialsProps {
  credentials: Credential[];
  loading: boolean;
}

export default function ShareCredentials({ credentials, loading }: ShareCredentialsProps) {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState("");
  const [expiry, setExpiry] = useState("");
  
  // Build the sharing link based on selected credential
  const selectedCredential = credentials.find((c) => c.tokenId === selectedTokenId);
  const shareLink = selectedCredential
    ? `http://192.168.100.199:3000/verifier?tokenId=${selectedCredential.tokenId}`
    : "";

  return (
    <>
      <div className="card">
        <h2 className="card-title">Share Your Credentials</h2>
        <p className="share-card-subtitle">
          Generate a secure link or QR code to share your credentials with your employers or institutions.
        </p>
        <div className="share-form-row">
          <div className="share-form-group">
            <label htmlFor="credential">Select credentials to share:</label>
            <select
              id="credential"
              className="share-select-input"
              value={selectedTokenId}
              onChange={e => setSelectedTokenId(e.target.value)}
              disabled={loading || credentials.length === 0}
            >
              <option value="">--Select Credential--</option>
              {credentials.map((cred) => (
                <option key={cred.tokenId} value={cred.tokenId}>
                  {cred.credentialType || "Credential"} ({cred.credentialCode})
                </option>
              ))}
            </select>
          </div>
          <div className="share-form-group">
            <label htmlFor="expiry">Expires after:</label>
            <select
              id="expiry"
              className="share-select-input"
              value={expiry}
              onChange={e => setExpiry(e.target.value)}
              disabled={loading}
            >
              <option value="">--Select--</option>
              <option value="1d">1 Day</option>
              <option value="1w">1 Week</option>
              <option value="1m">1 Month</option>
            </select>
          </div>
        </div>
        <div className="share-button-row">
          <button
            className="share-btn"
            disabled={!selectedTokenId}
            onClick={() => {
              if (shareLink) {
                navigator.clipboard.writeText(shareLink);
                alert("Sharing link copied to clipboard!");
              }
            }}
          >
            Generate Sharing Link
          </button>
          <button
            className="share-btn"
            disabled={!selectedTokenId}
            onClick={() => setIsQRModalOpen(true)}
          >
            Generate QR Code
          </button>
        </div>
      </div>
      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        qrValue={shareLink}
      />
    </>
  );
}
