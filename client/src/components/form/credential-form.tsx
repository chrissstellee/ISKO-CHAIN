/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, ChangeEvent, useEffect, useRef } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import IskoChainCredentialABI from "@/lib/IskoChainCredential.json";
import { createClient } from "urql";
import { cacheExchange, fetchExchange } from "@urql/core";
import MySwal from "@/lib/swal";
import "@/styles/card.css";
import "@/styles/text.css";
import "@/styles/button.css";
import "@/styles/admin.css";
import "@/styles/inputs.css";
import "@/styles/table.css";
import "@/styles/chip.css";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS;
const SUBGRAPH_URL = "https://api.studio.thegraph.com/query/113934/isko-chain/version/latest";
const client = createClient({
  url: SUBGRAPH_URL,
  exchanges: [cacheExchange, fetchExchange],
});

// Check subgraph for existing active degree certificate for this student
async function hasActiveDegreeCertificate(studentId: string): Promise<boolean> {
  const query = `
    query($studentId: String!) {
      credentials(
        where: {
          studentId: $studentId
          credentialType: "Degree Certificate"
          status: "active"
        }
      ) {
        id
      }
    }
  `;
  try {
    const res = await fetch(SUBGRAPH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { studentId } }),
    });
    const data = await res.json();
    return data.data && data.data.credentials && data.data.credentials.length > 0;
  } catch {
    // If subgraph fails, let the contract handle the rule
    return false;
  }
}

async function waitForSubgraphCredential(credentialCode: string, maxWaitMs = 10000): Promise<boolean> {
  const query = `
    query($code: String!) {
      credentials(where: { credentialCode: $code }) {
        tokenId
      }
    }
  `;
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const res = await fetch(SUBGRAPH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { code: credentialCode } }),
    });
    try {
      const data = await res.json();
      if (data.data && data.data.credentials && data.data.credentials.length > 0) {
        return true;
      }
    } catch {}
    await new Promise(res => setTimeout(res, 1500));
  }
  // Final check
  const res = await fetch(SUBGRAPH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { code: credentialCode } }),
  });
  try {
    const data = await res.json();
    if (data.data && data.data.credentials && data.data.credentials.length > 0) {
      return true;
    }
  } catch {}
  return false;
}

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
  onIssueSuccess?: () => void;
}

function extractRevertReason(err: any) {
  if (err?.reason) return err.reason;
  if (err?.error?.message) return err.error.message;
  if (err?.data?.message) return err.data.message;
  if (err?.message) {
    if (err.message.includes("Not an admin")) return "You are not an admin.";
    if (err.message.includes("already has an active Degree Certificate")) return "Student already has an active Degree Certificate.";
    return err.message;
  }
  return "Unknown blockchain error.";
}

export default function IssueCredentialsForm({ onSubmit, onIssueSuccess }: Props) {
  const [credentialType, setCredentialType] = useState("");
  const [studentId, setStudentId] = useState("");
  const [credentialDetails, setCredentialDetails] = useState("");
  const [issueDate, setIssueDate] = useState(getTodayDateString());
  const [issuer, setIssuer] = useState("");
  const [metadata, setMetadata] = useState("");
  const [credentialCode, setCredentialCode] = useState("");

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

  useEffect(() => {
    setIssueDate(getTodayDateString());
  }, []);

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

  const handleRefresh = () => {
    setCredentialType('');
    setStudentId('');
    setCredentialDetails('');
    setIssueDate(getTodayDateString());
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!credentialType) newErrors.credentialType = "Credential type is required.";
    if (!studentId || !/^[a-zA-Z0-9\-]+$/.test(studentId)) newErrors.studentId = "Valid alphanumeric student ID is required.";
    if (!credentialDetails) newErrors.credentialDetails = "Credential title is required.";
    if (!issuer) newErrors.issuer = "Issuer email not loaded. Please try again.";
    if (!firstName) newErrors.firstName = "First name required (check student ID).";
    if (!lastName) newErrors.lastName = "Last name required (check student ID).";
    if (!yearLevel) newErrors.yearLevel = "Year level required (check student ID).";
    if (!programName) newErrors.program = "Program required (check student ID).";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- MAIN SUBMIT WITH DEGREE CERTIFICATE CHECK ---
  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Only block if "Degree Certificate" and there's an active one already
    if (credentialType === "Degree Certificate") {
      setStatus("Checking if student already has an active Degree Certificate...");
      const hasActive = await hasActiveDegreeCertificate(studentId);
      if (hasActive) {
        await MySwal.fire({
          icon: "warning",
          title: "Active Degree Detected",
          text: "Student already has an active Degree Certificate. Revoke the previous credential before issuing a new one.",
          confirmButtonColor: "#b71c1c",
        });
        setStatus("");
        return;
      }
    }

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

      // Backend issues metadata
      const res = await fetch("http://localhost:3001/credentials/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentialMetadata),
      });

      const { tokenURI, walletAddress, error, credentialCode: generatedCode } = await res.json();

      if (error) {
        await MySwal.fire({
          icon: "error",
          title: "Issue Failed",
          text: error,
          confirmButtonColor: "#b71c1c",
        });
        setStatus("");
        return;
      }
      if (!tokenURI || !walletAddress || !generatedCode) {
        await MySwal.fire({
          icon: "error",
          title: "Issue Failed",
          text: "Failed to issue credential. Please try again.",
          confirmButtonColor: "#b71c1c",
        });
        setStatus("");
        return;
      }

      setCredentialCode(generatedCode);

      setStatus("Minting NFT on blockchain...");
      if (!walletClient || !isConnected) {
        await MySwal.fire({
          icon: "error",
          title: "Wallet Not Connected",
          text: "Please connect your wallet.",
          confirmButtonColor: "#b71c1c",
        });    
        setStatus("");
        return;
      }
      if (!window.ethereum) {
        await MySwal.fire({
          icon: "error",
          title: "No Wallet Extension",
          text: "No wallet extension found.",
          confirmButtonColor: "#b71c1c",
        });
        setStatus("");
        return;
      }
      if (!CONTRACT_ADDRESS) {
        await MySwal.fire({
          icon: "error",
          title: "Missing Contract",
          text: "Smart contract address is not configured.",
          confirmButtonColor: "#b71c1c",
        });
        setStatus("");
        return;
      }

      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, IskoChainCredentialABI, signer);

      try {
        // Mint to student walletAddress (not studentId)
        const tx = await contract.issueCredential(walletAddress, tokenURI, studentId, credentialType);
        await tx.wait();

        setStatus("Waiting for The Graph to index the new credential...");

        // --- POLLING LOGIC ---
        const found = await waitForSubgraphCredential(generatedCode);

        if (found) {
          await MySwal.fire({
            icon: "success",
            title: "Credential Issued",
            text: "Credential issued and indexed!",
            confirmButtonColor: "#b71c1c",
          });
          setStatus("");
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
          if (onIssueSuccess) {
            onIssueSuccess();
          }
          handleRefresh();
        } else {
          await MySwal.fire({
            icon: "warning",
            title: "Subgraph Delay",
            text: "Credential issued, but subgraph did not index it in time. It will appear soon.",
            confirmButtonColor: "#b71c1c",
          });
          setStatus("");
          if (onIssueSuccess) {
            onIssueSuccess();
          }
          handleRefresh();
        }
      } catch (err: any) {
        // --- Blockchain Mint Revert/Error Handling ---
        let reason = extractRevertReason(err);
        let userMessage = "Blockchain mint failed.";
        if (reason === "Not an admin" || reason.includes("Not an admin")) {
          userMessage = "Blockchain mint failed. You are not an admin. Please login with an admin wallet.";
        } else if (reason.includes("already has an active Degree Certificate")) {
          userMessage = "Blockchain mint failed. Student already has an active Degree Certificate. Revoke the previous credential before issuing a new one.";
        } else if (reason !== "Unknown blockchain error.") {
          userMessage += " Reason: " + reason;
        }
        await MySwal.fire({
          icon: "error",
          title: "Mint Failed",
          text: userMessage,
          confirmButtonColor: "#b71c1c",
        });
        setStatus("");
        console.error(err);
        return;
      }
    } catch (err: any) {
      await MySwal.fire({
        icon: "error",
        title: "Server Error",
        text: "Failed to upload credential metadata. " + (err?.message || ""),
        confirmButtonColor: "#b71c1c",
      });
      setStatus("");
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
          className={`form-control form-select-white ${errors.credentialType ? "input-error-border" : ""}`}
          value={credentialType || ""}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setCredentialType(e.target.value)}
        >
          <option value="">-- Select Type --</option>
          <option>Degree Certificate</option>
          <option>Course Completion</option>
          <option>Honor/Award</option>
          <option>Workshop Completion</option>
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
        </div>
      </div>

      {/* REMOVED Issue Date field from UI */}

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
