/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, ChangeEvent } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import IskoChainCredentialABI from "@/lib/IskoChainCredential.json"; // Adjust as needed
import '@/styles/card.css';
import '@/styles/text.css';
import '@/styles/button.css';
import '@/styles/admin.css';
import '@/styles/inputs.css';
import '@/styles/table.css';
import '@/styles/chip.css';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS; // TODO: Replace with your contract address

interface CredentialData {
  credentialType: string;
  studentId: string;
  credentialDetails: string;
  issueDate: string;
  metadata: string;
}

interface Props {
  onSubmit?: (data: CredentialData) => void;
}

export default function IssueCredentialsForm({ onSubmit }: Props) {
  const [credentialType, setCredentialType] = useState("");
  const [studentId, setStudentId] = useState("");
  const [credentialDetails, setCredentialDetails] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [metadata, setMetadata] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState(""); // For UX status messages

  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!credentialType) newErrors.credentialType = "Credential type is required.";
    if (!studentId || !/^[a-zA-Z0-9]+$/.test(studentId)) newErrors.studentId = "Valid alphanumeric student ID is required.";
    if (!credentialDetails) newErrors.credentialDetails = "Credential title is required.";
    if (!issueDate) {
      newErrors.issueDate = "Issue date is required.";
    } else {
      const selectedDate = new Date(issueDate);
      const today = new Date(getTodayDateString());
      if (selectedDate < today) {
        newErrors.issueDate = "Issue date cannot be a past date.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset all fields
  const handleRefresh = () => {
    setCredentialType('');
    setStudentId('');
    setCredentialDetails('');
    setIssueDate('');
    setMetadata('');
    setErrors({});
    setStatus('');
  };

  // Main submission logic (API + blockchain)
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setStatus("Uploading metadata to backend server...");
    try {
      // 1. Call your NestJS backend API (NOT Next.js API route)
      const res = await fetch("http://localhost:3001/credentials/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credentialType,
          studentId,
          credentialDetails,
          issueDate,
          metadata,
        }),
      });

      const { tokenURI, walletAddress, error } = await res.json();

      if (error) {
        setStatus(error);
        return;
      }
      if (!tokenURI || !walletAddress) {
        setStatus("No credential info returned from server.");
        return;
      }

      setStatus("Minting NFT on blockchain...");
      if (!walletClient || !isConnected) {
        setStatus("Wallet not connected.");
        return;
      }

      // Get ethers.js signer from window.ethereum (v6)
      if (!window.ethereum) {
        setStatus("No wallet extension found.");
        return;
      }

      if (!CONTRACT_ADDRESS) {
        setStatus("Smart contract address is not configured.");
        return;
      }
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, IskoChainCredentialABI, signer);

      // IMPORTANT: Mint to student walletAddress (not studentId)
      const tx = await contract.issueCredential(walletAddress, tokenURI);
      await tx.wait();

      setStatus("✅ Credential issued successfully!");
      handleRefresh();

      // Optional: Call onSubmit prop for parent
      if (onSubmit) {
        onSubmit({
          credentialType,
          studentId,
          credentialDetails,
          issueDate,
          metadata,
        });
      }
    } catch (err: any) {
      setStatus("Blockchain mint failed. " + (err?.message || ""));
      console.error(err);
    }
  };

  return (
    <div className="card">
      <div className="admin-header-row">
        <h2 className="card-title">Issue New Credentials</h2>
        <button className="refresh-button" onClick={handleRefresh}>⟳ Refresh</button>
      </div>

      <div className="form-group">
        <label className="input-label">Credential Type:</label>
        <select
          className={`form-control ${errors.credentialType ? "input-error-border" : ""}`}
          value={credentialType}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setCredentialType(e.target.value)}
        >
          <option value="">-- Select Type --</option>
          <option>Degree Certificate</option>
          <option>Course Completion</option>
          <option>Honor/Award</option>
          <option>Workshop Certificate</option>
          <option>Transcript</option>
        </select>
        {errors.credentialType && <span className="input-error">{errors.credentialType}</span>}
      </div>

      <div className="form-group">
        <label className="input-label">Student ID:</label>
        <input
          type="text"
          placeholder="Enter student ID here..."
          className={`form-control ${errors.studentId ? "input-error-border" : ""}`}
          value={studentId}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setStudentId(e.target.value)}
        />
        {errors.studentId && <span className="input-error">{errors.studentId}</span>}
      </div>

      <div className="form-group">
        <div className="input-row">
          <div className="input-column input-column--large">
            <label className="input-label">Credential Details:</label>
            <input
              type="text"
              placeholder="Enter credentials here..."
              className={`form-control ${errors.credentialDetails ? "input-error-border" : ""}`}
              value={credentialDetails}
              onChange={(e) => setCredentialDetails(e.target.value)}
            />
            {errors.credentialDetails && <span className="input-error">{errors.credentialDetails}</span>}
          </div>

          <div className="input-column input-column--small">
            <label className="input-label">Date:</label>
            <input
              type="date"
              className={`date-picker ${errors.issueDate ? "input-error-border" : ""}`}
              value={issueDate}
              min={getTodayDateString()}
              onChange={(e) => setIssueDate(e.target.value)}
            />
            {errors.issueDate && <span className="input-error">{errors.issueDate}</span>}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="input-label">Additional Metadata:</label>
        <textarea
          placeholder="Add any additional information to be stored with the credential..."
          className="metadata-textarea"
          value={metadata}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMetadata(e.target.value)}
        ></textarea>
      </div>

      <div className="action-buttons">
        <button className="prev-button" type="button">Preview</button>
        <button className="issue-button" type="button" onClick={handleSubmit}>
          Issue Credential
        </button>
      </div>

      {status && (
        <div className="status-message" style={{ marginTop: 12 }}>
          {status}
        </div>
      )}
    </div>
  );
}
