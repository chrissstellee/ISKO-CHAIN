/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Navbar from '@/components/navbar';
import CredentialDetails from "@/app/verifier/credential-details";
import Verification from "@/app/verifier/verification";
import '@/styles/verifier.css';

// Optionally, define types if you have them.
export default function Verifier() {
  // State for the currently verified credential and transfer
  const [credential, setCredential] = useState<any | null>(null);
  const [transfer, setTransfer] = useState<any | null>(null);

  return (
    <div>
      <Navbar />
      <div className="screen-container">
        <h1 className="page-title">Verify Academic Credentials</h1>
        <div className="card">
          {/* Pass down setCredential and setTransfer so Verification can update */}
          <Verification setCredential={setCredential} setTransfer={setTransfer} />
        </div>
        {/* Pass credential and transfer data to CredentialDetails for display */}
        <CredentialDetails credential={credential} transfer={transfer} />
      </div>
    </div>
  );
}
