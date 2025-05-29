"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import "@/styles/card.css";
import "@/styles/text.css";
import "@/styles/button.css";

export default function Verification() {
  const [credentialId, setCredentialId] = useState('');
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);

  const handleQrImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setQrImage(objectUrl);
      setVerificationStatus("verified"); // Simulated
    }
  };

  const handleVerify = () => {
    if (credentialId === '12345') {
      setVerificationStatus('verified');
    } else if (credentialId === '54321') {
      setVerificationStatus('alreadyVerified');
    } else {
      setVerificationStatus('invalid');
    }
  };

  const handleRefresh = () => {
    setCredentialId('');
    setQrImage(null);
    setVerificationStatus(null);
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
              placeholder="Enter credential ID or hash..."
              className="identifier-input-field"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
            />
            <button className="verify-button" onClick={handleVerify}>Verify</button>
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
      {verificationStatus === 'verified' && (
        <div className="verification-result">
          <div className="check-icon"><i className="ri-check-line"></i></div>
          <p className="result-title">Credential Successfully Verified!</p>
          <p className="result-subtext">This credential has been cryptographically verified on the blockchain.</p>
        </div>
      )}

      {verificationStatus === 'alreadyVerified' && (
        <div className="verification-result">
          <div className="check-icon"><i className="ri-check-line"></i></div>
          <p className="result-title">Credential Already Verified!</p>
          <p className="result-subtext">This credential has already been cryptographically verified on the blockchain.</p>
        </div>
      )}

      {verificationStatus === 'invalid' && (
        <div className="verification-invalid">
          <div className="check-icon"><i className="ri-close-line"></i></div>
          <p className="invalid-title">Credential is Invalid!</p>
          <p className="result-subtext">This credential is invalid.</p>
        </div>
      )}
    </div>
  );
}
