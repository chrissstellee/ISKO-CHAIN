/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, ChangeEvent, useEffect, useRef } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import IskoChainCredentialABI from "@/lib/IskoChainCredential.json";
import '@/styles/card.css';
import '@/styles/text.css';
import '@/styles/button.css';
import '@/styles/admin.css';
import '@/styles/inputs.css';
import '@/styles/table.css';
import '@/styles/chip.css';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS;

interface CredentialData {
  credentialType: string;
  studentId: string;
  credentialDetails: string;
  issueDate: string;
  issuer: string;
  metadata: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  yearLevel?: number;
  programName?: string;
  credentialCode?: string;
}

interface Props {
  onSubmit?: (data: CredentialData) => void;
}

export default function IssueCredentialsForm({ onSubmit }: Props) {
  // Form state
  const [credentialType, setCredentialType] = useState("");
  const [studentId, setStudentId] = useState("");
  const [credentialDetails, setCredentialDetails] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [issuer, setIssuer] = useState("");
  const [metadata, setMetadata] = useState("");
  const [credentialCode, setCredentialCode] = useState(""); // This will be set after backend responds

  // Student info
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [yearLevel, setYearLevel] = useState<number | "">("");
  const [programName, setProgramName] = useState("");
  const [loadingIssuer, setLoadingIssuer] = useState(false);
  const [loadingStudent, setLoadingStudent] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");

  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  // Fetch admin email on mount or address change
  useEffect(() => {
    if (!address) return;
    setLoadingIssuer(true);

    const message = "Authenticate to ISKO-CHAIN";
    async function fetchIssuer() {
      if (!window.ethereum) {
        setLoadingIssuer(false);
        return;
      }
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const signature = await signer.signMessage(message);

        const res = await fetch('http://localhost:3001/auth/me', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, signature, message }),
        });
        const data = await res.json();
        setIssuer(data.email || "admin");
      } catch (err) {
        setIssuer("admin");
      } finally {
        setLoadingIssuer(false);
      }
    }
    fetchIssuer();
  }, [address]);

  // Debounced fetch of student info (including program)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setYearLevel("");
    setProgramName("");
    if (!studentId || !/^[a-zA-Z0-9\-]+$/.test(studentId)) return;

    setLoadingStudent(true);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:3001/users/by-student-id/${studentId}`);
        if (!res.ok) throw new Error("Student not found");
        const user = await res.json();
        setFirstName(user.firstName || "");
        setMiddleName(user.middleName || "");
        setLastName(user.lastName || "");
        setYearLevel(user.yearLevel || "");
        setProgramName(user.program?.name || "");
      } catch {
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setYearLevel("");
        setProgramName("");
      } finally {
        setLoadingStudent(false);
      }
    }, 600);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [studentId]);

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
    if (!studentId || !/^[a-zA-Z0-9\-]+$/.test(studentId)) newErrors.studentId = "Valid alphanumeric student ID is required.";
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
    if (!issuer) newErrors.issuer = "Issuer email not loaded. Please try again.";
    if (!firstName) newErrors.firstName = "First name required (check student ID).";
    if (!lastName) newErrors.lastName = "Last name required (check student ID).";
    if (!yearLevel) newErrors.yearLevel = "Year level required (check student ID).";
    if (!programName) newErrors.program = "Program required (check student ID).";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRefresh = () => {
    setCredentialType('');
    setStudentId('');
    setCredentialDetails('');
    setIssueDate('');
    setMetadata('');
    setErrors({});
    setStatus('');
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setYearLevel('');
    setProgramName('');
    setCredentialCode('');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setStatus("Uploading credential metadata...");
    setCredentialCode("");
    try {
      const credentialMetadata = {
        credentialType,
        studentId,
        credentialDetails,
        issueDate,
        issuer,
        additionalInfo: metadata,
        firstName,
        middleName,
        lastName,
        yearLevel: yearLevel === "" ? undefined : yearLevel,
        programName,
      };

      // Call backend; credentialCode will be generated there
      const res = await fetch("http://localhost:3001/credentials/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentialMetadata),
      });

      const { tokenURI, walletAddress, error, credentialCode: generatedCode } = await res.json();

      if (error) {
        setStatus(error);
        return;
      }
      if (!tokenURI || !walletAddress || !generatedCode) {
        setStatus("No credential info returned from server.");
        return;
      }

      setCredentialCode(generatedCode);

      setStatus("Minting NFT on blockchain...");
      if (!walletClient || !isConnected) {
        setStatus("Wallet not connected.");
        return;
      }

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

      // Mint to student walletAddress (not studentId)
      const tx = await contract.issueCredential(walletAddress, tokenURI);
      await tx.wait();

      setStatus("✅ Credential issued successfully!");
      // Optionally keep credential code visible

      if (onSubmit) {
        onSubmit({
          credentialType,
          studentId,
          credentialDetails,
          issueDate,
          issuer,
          metadata,
          firstName,
          middleName,
          lastName,
          yearLevel: yearLevel === "" ? undefined : yearLevel,
          programName,
          credentialCode: generatedCode,
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
          value={credentialType || ""}
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
          value={studentId || ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setStudentId(e.target.value)}
        />
        {errors.studentId && <span className="input-error">{errors.studentId}</span>}
      </div>

      {/* Student Info */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label className="input-label">First Name</label>
            <input
              type="text"
              value={firstName || ""}
              className={`form-control bg-gray-100 text-gray-500`}
              readOnly
              placeholder="First Name"
            />
            {errors.firstName && <span className="input-error">{errors.firstName}</span>}
          </div>
          <div style={{ flex: 1 }}>
            <label className="input-label">Middle Name</label>
            <input
              type="text"
              value={middleName || ""}
              className="form-control bg-gray-100 text-gray-500"
              readOnly
              placeholder="Middle Name (optional)"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label className="input-label">Last Name</label>
            <input
              type="text"
              value={lastName || ""}
              className={`form-control bg-gray-100 text-gray-500`}
              readOnly
              placeholder="Last Name"
            />
            {errors.lastName && <span className="input-error">{errors.lastName}</span>}
          </div>
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label className="input-label">Year Level</label>
            <input
              type="text"
              value={yearLevel || ""}
              className="form-control bg-gray-100 text-gray-500"
              readOnly
              placeholder="Year Level"
            />
            {errors.yearLevel && <span className="input-error">{errors.yearLevel}</span>}
          </div>
          <div style={{ flex: 2 }}>
            <label className="input-label">Program</label>
            <input
              type="text"
              value={programName || ""}
              className="form-control bg-gray-100 text-gray-500"
              readOnly
              placeholder="Program"
            />
            {errors.program && <span className="input-error">{errors.program}</span>}
            {loadingStudent && (
              <span style={{ marginLeft: 12, fontSize: 13 }}>Loading student info...</span>
            )}
          </div>
        </div>
      </div>

      {/* Credential Code (readonly, after generated) */}
      <div className="form-group">
        <label className="input-label">Credential Code:</label>
        <input
          type="text"
          className="form-control bg-gray-100 text-gray-700"
          value={credentialCode || ""}
          readOnly
          disabled
          placeholder="Auto-generated after issuing"
        />
      </div>

      <div className="form-group">
        <div className="input-row">
          <div className="input-column input-column--large">
            <label className="input-label">Credential Title/Details:</label>
            <input
              type="text"
              placeholder="Enter credential details here..."
              className={`form-control ${errors.credentialDetails ? "input-error-border" : ""}`}
              value={credentialDetails || ""}
              onChange={(e) => setCredentialDetails(e.target.value)}
            />
            {errors.credentialDetails && <span className="input-error">{errors.credentialDetails}</span>}
          </div>
          <div className="input-column input-column--small">
            <label className="input-label">Issue Date:</label>
            <input
              type="date"
              className={`date-picker ${errors.issueDate ? "input-error-border" : ""}`}
              value={issueDate || ""}
              min={getTodayDateString()}
              onChange={(e) => setIssueDate(e.target.value)}
            />
            {errors.issueDate && <span className="input-error">{errors.issueDate}</span>}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="input-label">Issuer (admin email):</label>
        <input
          type="text"
          className={`form-control input-readonly ${errors.issuer ? "input-error-border" : ""} bg-gray-100 text-gray-500`}
          value={issuer || ""}
          readOnly
        />
        {loadingIssuer && <span style={{ marginLeft: 12 }}>Loading issuer email...</span>}
        {errors.issuer && <span className="input-error">{errors.issuer}</span>}
      </div>

      <div className="form-group">
        <label className="input-label">Additional Metadata:</label>
        <textarea
          placeholder="Add any additional information to be stored with the credential..."
          className="metadata-textarea"
          value={metadata || ""}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMetadata(e.target.value)}
        ></textarea>
      </div>

      <div className="action-buttons">
        <button className="prev-button" type="button" disabled={loadingIssuer}>
          Preview
        </button>
        <button
          className="issue-button"
          type="button"
          onClick={handleSubmit}
          disabled={loadingIssuer || !issuer || loadingStudent}
        >
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

function getTodayDateString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
