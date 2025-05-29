"use client"

import React, { useState } from 'react';
import QRCodeModal from '@/components/modal/student-qr'; 

export default function ShareCredentials() {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Example value to encode in the QR
  const qrValue = 'https://yourdomain.com/credential/example-id';

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
            <select id="credential" className="share-select-input">
              <option>--Select Credentials--</option>
              <option>Bachelor of Science</option>
              <option>Academic Excellence Award</option>
            </select>
          </div>

          <div className="share-form-group">
            <label htmlFor="expiry">Expires after:</label>
            <select id="expiry" className="share-select-input">
              <option>--Select --</option>
              <option>1 Day</option>
              <option>1 Week</option>
              <option>1 Month</option>
            </select>
          </div>
        </div>

        <div className="share-button-row">
          <button className="share-btn">Generate Sharing Link</button>
          <button className="share-btn" onClick={() => setIsQRModalOpen(true)}>
            Generate QR Code
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        qrValue={qrValue}
      />
    </>
  );
}
