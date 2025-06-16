/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from 'react';
import CertificateModal from "@/components/modal/certificate-modal";
import "@/styles/verifier.css";
import "@/styles/card.css";
import "@/styles/text.css";
import "@/styles/button.css";
import React from 'react';

interface Props {
  credential: any | null;
  transfer: any | null;
}

export default function CredentialDetails({ credential, transfer }: Props) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  if (!credential) {
    return (
      <div className="card" style={{ marginTop: 24 }}>
        <h2 className="card-title">Credential Details</h2>
        <div style={{ color: "#888", padding: 16 }}>No credential loaded. Please verify first.</div>
      </div>
    );
  }

  const {
    credentialCode,
    credentialType,
    credentialDetails,
    firstName,
    lastName,
    issueDate,
    issuer,
    program,
    tokenId,
    owner,
  } = credential;
  const blockchain = "Base Sepolia";

  return (
    <div className="card" style={{ marginTop: 24 }}>
      <h2 className="card-title">Credential Details</h2>
      <div className="details-grid">
        <div>
          <div className="info-section">
            <h3 className="info-header">Credential Information</h3>
            <p>
              <b>Credential Code:</b> {credentialCode}
            </p>
            <p>
              <b>Type:</b> {credentialType}
            </p>
            <p>
              <b>Details:</b> {credentialDetails}
            </p>
            <p>
              <b>Issuer:</b> {issuer}
            </p>
            <p>
              <b>Issue Date:</b> {issueDate}
            </p>
          </div>
          <div className="info-section">
            <h3 className="info-header">Student Information</h3>
            <p>
              <b>Name:</b> {firstName} {lastName}
            </p>
            <p>
              <b>Program:</b> {program}
            </p>
          </div>
          <div className="info-section">
            <h3 className="info-header">Blockchain Information</h3>
            <p>
              <b>Blockchain Network:</b> {blockchain}
            </p>
            <p>
              <b>Token ID:</b> {tokenId}
            </p>
            <p>
              <b>Owner:</b> {owner}
            </p>
            {transfer && (
              <>
                <p>
                  <b>Block Number:</b> {transfer.blockNumber}
                </p>
                <p>
                  <b>Transaction Hash:</b>{" "}
                  <a
                    href={`https://sepolia.basescan.org/tx/${transfer.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#b71c1c" }}
                  >
                    {transfer.transactionHash}
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
        {/* Certificate Preview (Modal Trigger) */}
        <div className="certificate-viewer">
          <div className="certificate-placeholder" />
          <button className="certificate-button" onClick={() => setIsModalOpen(true)}>
            View Certificate
          </button>
        </div>
      </div>
      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        certificateContent={
          <img src="/path/to/certificate.jpg" alt="Certificate" />
          // Or dynamically generate from credential info if you wish
        }
      />
    </div>
  );
}
