"use client";

import Navbar from '@/components/navbar';
import CredentialDetails from "@/app/verifier/credential-details";
import Verification from "@/app/verifier/verification";

import '@/styles/verifier.css';

export default function Verifier() {
  return (
    <div>
      <Navbar />
      <div className="screen-container">
        <h1 className="page-title">Verify Academic Credentials</h1>
        <div className="card">
          <Verification />
        </div>
        <CredentialDetails />
      </div>
    </div>
  );
}
