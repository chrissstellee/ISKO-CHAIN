/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, FormEvent } from "react";
import { ethers } from "ethers";
import IskoChainCredentialABI from "@/lib/IskoChainCredential.json";
import { PAGE_SIZE, useRecentActivity } from "./useRecentActivity";
import ReissueModal from "./ReissueModal";
import RevokeReasonModal from "./RevokeReasonModal";
import { CredentialActivity, RecentActivityProps } from "./types";
import BlockchainTableLoader from "@/components/ui/loading";
import MySwal from "@/lib/swal"; // <-- SweetAlert2 instance

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS as string;

function getStatusClass(action: string) {
  switch (action) {
    case "Issued": return "chip success";
    case "Revoked": return "chip error";
    case "Reissued": return "chip process";
    default: return "chip default";
  }
}

async function waitForSubgraphStatus(tokenId: string, expectedStatus: string, maxWaitMs = 10000) {
  const SUBGRAPH_URL = "https://api.studio.thegraph.com/query/113934/isko-chain/version/latest";
  const query = `
    query($id: ID!) {
      credential(id: $id) {
        status
      }
    }
  `;
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const res = await fetch(SUBGRAPH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { id: tokenId } }),
    });
    try {
      const data = await res.json();
      if (
        data.data &&
        data.data.credential &&
        data.data.credential.status &&
        data.data.credential.status.toLowerCase().includes(expectedStatus.toLowerCase())
      ) {
        return true;
      }
    } catch { }
    await new Promise(res => setTimeout(res, 1500));
  }
  return false;
}

export default function RecentActivity({ refreshCount, onAnyAction }: RecentActivityProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Issued' | 'Revoked' | 'Reissued'>('All');
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalCredential, setModalCredential] = useState<CredentialActivity | null>(null);
  const [form, setForm] = useState<Partial<CredentialActivity>>({});
  const [submitting, setSubmitting] = useState(false);

  // For revoke modal
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [revokeLoading, setRevokeLoading] = useState(false);
  const [revokeReason, setRevokeReason] = useState("");
  const [revokeCredential, setRevokeCredential] = useState<CredentialActivity | null>(null);

  const { rows, total, loading } = useRecentActivity(page, refreshCount, refresh);

  // --- Filtering logic for loaded page only ---
  const filtered = rows.filter(row => {
    const matchFilter =
      filter === 'All' ||
      (filter === 'Issued' && row.status === 'Issued') ||
      (filter === 'Revoked' && row.status === 'Revoked') ||
      (filter === 'Reissued' && row.status === 'Reissued');
    const matchSearch =
      search === '' ||
      (row.details && row.details.toLowerCase().includes(search.toLowerCase())) ||
      (row.user && row.user.toLowerCase().includes(search.toLowerCase())) ||
      (row.firstName && row.firstName.toLowerCase().includes(search.toLowerCase())) ||
      (row.lastName && row.lastName.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  // --- Revoke logic using Modal ---
  function openRevokeModal(credential: CredentialActivity) {
    setRevokeCredential(credential);
    setRevokeReason("");
    setRevokeModalOpen(true);
  }

  async function handleConfirmRevoke(e: FormEvent) {
    e.preventDefault();
    if (!revokeCredential || !revokeReason.trim()) return;
    setRevokeLoading(true);
    try {
      if (!window.ethereum) {
        await MySwal.fire({
          icon: "error",
          title: "MetaMask Required",
          text: "MetaMask is not installed!",
          confirmButtonColor: "#b71c1c",
        });
        setRevokeLoading(false);
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, IskoChainCredentialABI, signer);

      const tx = await contract.revokeCredential(revokeCredential.tokenId, revokeReason);
      await tx.wait();

      // Wait for subgraph to reflect
      const found = await waitForSubgraphStatus(revokeCredential.tokenId, "revoked", 15000);
      if (found) {
        await MySwal.fire({
          icon: "success",
          title: "Credential Revoked",
          text: "Credential revoked and subgraph updated!",
          confirmButtonColor: "#b71c1c",
        });
        setRefresh(x => x + 1);
        onAnyAction?.();
      } else {
        await MySwal.fire({
          icon: "warning",
          title: "Subgraph Delay",
          text: "Revoked on-chain, but subgraph did not index in time. It will appear soon.",
          confirmButtonColor: "#b71c1c",
        });
        setTimeout(() => {
          setRefresh(x => x + 1);
          onAnyAction?.();
        }, 2000);
      }
      setRevokeModalOpen(false);
      setRevokeLoading(false);
      setRevokeCredential(null);
      setRevokeReason("");
    } catch (e: any) {
      await MySwal.fire({
        icon: "error",
        title: "Revocation Failed",
        text: e?.reason || e?.message || "Transaction failed.",
        confirmButtonColor: "#b71c1c",
      });
      console.error(e);
      setRevokeLoading(false);
    }
  }

  // --- Reissue logic ---
  function handleOpenReissue(credential: CredentialActivity) {
    setForm({
      ...credential,
      credentialType: credential.credentialType || "",
      credentialDetails: credential.credentialDetails || "",
      issueDate: new Date().toISOString().slice(0, 10),
    });
    setModalCredential(credential);
    setModalOpen(true);
  }

  async function handleReissueSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. Request new tokenURI from backend
      const metaRes = await fetch("http://localhost:3001/credentials/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credentialType: form.credentialType,
          credentialDetails: form.credentialDetails,
          studentId: modalCredential?.studentId,
          issueDate: form.issueDate,
          issuer: modalCredential?.issuer,
          additionalInfo: form.additionalInfo,
          firstName: modalCredential?.firstName,
          lastName: modalCredential?.lastName,
          middleName: modalCredential?.middleName,
          yearLevel: modalCredential?.yearLevel,
          programName: modalCredential?.program,
        }),
      });
      if (!metaRes.ok) throw new Error("Failed to generate tokenURI!");
      const { tokenURI, walletAddress } = await metaRes.json();

      if (!window.ethereum) {
        await MySwal.fire({
          icon: "error",
          title: "MetaMask Required",
          text: "MetaMask is not installed!",
          confirmButtonColor: "#b71c1c",
        });
        setSubmitting(false);
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, IskoChainCredentialABI, signer);

      const tx = await contract.reissueCredential(
        modalCredential?.tokenId,
        walletAddress,
        tokenURI,
        "Reissued: " + (form.revocationReason || "No reason provided")
      );
      await tx.wait();

      // Wait for subgraph to reflect
      const found = await waitForSubgraphStatus(modalCredential?.tokenId!, "revoked", 15000);
      if (found) {
        await MySwal.fire({
          icon: "success",
          title: "Credential Reissued",
          text: "Credential reissued (revoked old) and subgraph updated!",
          confirmButtonColor: "#b71c1c",
        });
        setModalOpen(false);
        setModalCredential(null);
        setRefresh(x => x + 1);
        onAnyAction?.(); // TRIGGER PARENT REFRESH
      } else {
        await MySwal.fire({
          icon: "warning",
          title: "Subgraph Delay",
          text: "Reissued on-chain, but subgraph did not index in time. It will appear soon.",
          confirmButtonColor: "#b71c1c",
        });
        setModalOpen(false);
        setModalCredential(null);
        setTimeout(() => {
          setRefresh(x => x + 1);
          onAnyAction?.();
        }, 2000);
      }
    } catch (e: any) {
      await MySwal.fire({
        icon: "error",
        title: "Reissue Failed",
        text: e?.reason || e?.message || "Transaction failed.",
        confirmButtonColor: "#b71c1c",
      });
      console.error(e);
    }
    setSubmitting(false);
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="card">
      <h2 className="card-title">Recent Activity</h2>
      <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
        <input
          style={{ flex: 1, borderRadius: 8, border: '1px solid #e2e8f0', padding: 8 }}
          placeholder="Search by details or user"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as any)}
          style={{ borderRadius: 8, padding: 8, border: '1px solid #e2e8f0' }}
        >
          <option value="All">All</option>
          <option value="Issued">Issued</option>
          <option value="Revoked">Revoked</option>
          <option value="Reissued">Reissued</option>
        </select>
      </div>

      {loading ? (
        <div className="py-8">
          <BlockchainTableLoader size="md" message="Loading credential activities..." />
        </div>
      ) : (
        <>
          <table className="activity-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Student</th>
                <th>Details</th>
                <th className="status-cell">Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((activity, idx) => (
                <tr key={idx}>
                  <td>{activity.dateTime}</td>
                  <td>{`${activity.firstName ?? ''} ${activity.lastName ?? ''}`}</td>
                  <td>{activity.details}</td>
                  <td className="status-cell">
                    <span className={getStatusClass(activity.status ?? "")}>
                      {activity.status}
                    </span>
                  </td>
                  <td>
                    {activity.status === "Issued" && (
                      <div style={{ display: "flex", gap: 6 }}>
                        {/* Revoke */}
                        <button
                          title="Revoke"
                          onClick={() => openRevokeModal(activity)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#b71c1c",
                            fontSize: 18,
                          }}
                          disabled={loading}
                        >
                          🛑
                        </button>
                        {/* Reissue */}
                        <button
                          title="Reissue"
                          onClick={() => handleOpenReissue(activity)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#388e3c",
                            fontSize: 18,
                          }}
                          disabled={loading}
                        >
                          ♻️
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 18
          }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ padding: "6px 18px", borderRadius: 7, border: "1px solid #eee" }}
            >
              Previous
            </button>
            <span>Page {page} of {totalPages} ({total} total)</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ padding: "6px 18px", borderRadius: 7, border: "1px solid #eee" }}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Modal for Revoke Reason */}
      <RevokeReasonModal
        open={revokeModalOpen}
        submitting={revokeLoading}
        credential={revokeCredential}
        reason={revokeReason}
        setReason={setRevokeReason}
        onClose={() => {
          setRevokeModalOpen(false);
          setRevokeCredential(null);
          setRevokeReason("");
        }}
        onSubmit={handleConfirmRevoke}
      />

      {/* Modal for Reissue */}
      <ReissueModal
        open={modalOpen}
        submitting={submitting}
        form={form}
        setForm={setForm}
        onClose={() => setModalOpen(false)}
        onSubmit={handleReissueSubmit}
      />
    </div>
  );
}
