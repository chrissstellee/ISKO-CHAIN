/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from 'react';
import CertificateModal from "@/components/modal/certificate-modal";
import "@/styles/verifier.css";
import "@/styles/card.css";
import "@/styles/text.css";
import "@/styles/button.css";

export default function CredentialDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Constants for easy backend integration
  const studentName = "Juan Dela Cruz";
  const studentId = "2019-00123-CM-0";
  const course = "Bachelor of Science in Computer Science";
  const school = "Polytechnic University of the Philippines";

  const issueDate = "May 15, 2023";
  const credentialType = "Degree";
  const issuer = "Office of the University Registrar";

  const tokenId = "#CP239432";
  const contract = "0x673d...d28b";
  const blockchain = "Base EVM";
  const transaction = "0x5a12...c74e";

  const verificationHistory = [
    "May 12, 2025 10:30pm",
    "May 01, 2025 10:30am",
  ];

  return (
    <div className="card">
      <h2 className="card-title">Credential Details</h2>

      <div className="details-grid">
        <div>
          <p className="info-header">{course}</p>
          <p className="info-section">{school}</p>

          <div className="info-section">
            <h3 className="info-header">Student Information</h3>
            <p>Name: {studentName}</p>
            <p>Student ID: {studentId}</p>
          </div>

          <div className="info-section">
            <h3 className="info-header">Credential Information</h3>
            <p>Issue Date: {issueDate}</p>
            <p>Credential Type: {credentialType}</p>
            <p>Issuer: {issuer}</p>
          </div>

          <div className="info-section">
            <h3 className="info-header">Blockchain Information</h3>
            <p>Token ID: {tokenId}</p>
            <p>Contract: {contract}</p>
            <p>Blockchain: {blockchain}</p>
            <p>Transaction: {transaction}</p>
          </div>
        </div>

        {/* View certificate */}
        <div className="certificate-viewer">
          <div className="certificate-placeholder" />
          <button
            className="certificate-button"
            onClick={() => setIsModalOpen(true)}
          >
            View Certificate
          </button>
        </div>
      </div>

      <div className="verification-history">
        <h3>Verification History</h3>
        <div className="history-tags">
          {verificationHistory.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      </div>

      <CertificateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        certificateContent={<img src="/path/to/certificate.jpg" alt="Certificate" />}
      />
    </div>
  );
}
