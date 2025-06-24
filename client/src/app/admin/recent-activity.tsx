/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { useEffect, useState, FormEvent } from 'react';
import { createClient, gql } from 'urql';
import { cacheExchange, fetchExchange } from "@urql/core";
import { ethers } from 'ethers';
import IskoChainCredentialABI from '@/lib/IskoChainCredential.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS as string;
if (!CONTRACT_ADDRESS) {
  throw new Error("NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS not set!");
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;
if (!SUBGRAPH_URL) {
  throw new Error("NEXT_PUBLIC_SUBGRAPH_URL environment variable is not set");
}
const client = createClient({
  url: SUBGRAPH_URL,
  exchanges: [cacheExchange, fetchExchange],
});

const PAGE_SIZE = 10;

const PAGINATED_QUERY = gql`
  query GetCredentials($skip: Int!, $first: Int!) {
    credentials(orderBy: updatedAt, orderDirection: desc, skip: $skip, first: $first) {
      tokenId
      credentialCode
      credentialType
      credentialDetails
      issuer
      firstName
      lastName
      owner
      status
      revocationReason
      replacedByTokenId
      createdAt
      updatedAt
      studentId
      program
      middleName
      yearLevel
      additionalInfo
    }
  }
`;

// Use _meta for faster total count
const COUNT_QUERY = gql`
  query {
    _meta {
      block {
        number
      }
      hasIndexingErrors
    }
    credentials {
      id
    }
  }
`;

async function waitForSubgraphStatus(tokenId: string, expectedStatus: string, maxWaitMs = 10000) {
  const query = `
    query($id: ID!) {
      credential(id: $id) {
        status
      }
    }
  `;
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const res = await fetch(SUBGRAPH_URL!, {
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
    } catch {}
    await new Promise(res => setTimeout(res, 1500));
  }
  // Final check
  const res = await fetch(SUBGRAPH_URL!, {
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
  } catch {}
  return false;
}

const getStatusClass = (action: string) => {
  switch (action) {
    case "Issued":
      return "chip success";
    case "Revoked":
      return "chip error";
    case "Reissued":
      return "chip process";
    default:
      return "chip default";
  }
};

function formatDateTime(timestamp: string | number) {
  return new Date(Number(timestamp) * 1000).toLocaleString();
}

export interface CredentialActivity {
  tokenId: string;
  credentialCode?: string;
  credentialType?: string;
  credentialDetails?: string;
  issuer?: string;
  firstName?: string;
  lastName?: string;
  owner?: string;
  status?: string;
  revocationReason?: string;
  replacedByTokenId?: string;
  createdAt?: string;
  updatedAt?: string;
  studentId?: string;
  program?: string;
  middleName?: string;
  yearLevel?: number;
  additionalInfo?: string;
  dateTime?: string;
  user?: string;
  details?: string;
  issueDate?: string;
}

interface RecentActivityProps {
  refreshCount?: number;
}

export default function RecentActivity({ refreshCount }: RecentActivityProps) {
  const [rows, setRows] = useState<CredentialActivity[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Issued' | 'Revoked' | 'Reissued'>('All');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCredential, setModalCredential] = useState<CredentialActivity | null>(null);
  const [refresh, setRefresh] = useState(0);

  const [form, setForm] = useState<Partial<CredentialActivity>>({});
  const [submitting, setSubmitting] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<number>(0);

  // Fetch paginated credentials
  useEffect(() => {
    setLoading(true);
    client.query(PAGINATED_QUERY, { skip: (page - 1) * PAGE_SIZE, first: PAGE_SIZE }, { requestPolicy: "network-only" })
      .toPromise()
      .then((result) => {
        if (!result.data) return;
        let activities: CredentialActivity[] = [];
        for (const cred of result.data.credentials) {
          let status = "Issued";
          let details = `${cred.credentialType}: ${cred.credentialDetails}`;
          if (cred.status === "revoked" && cred.revocationReason) {
            status = cred.replacedByTokenId ? "Reissued" : "Revoked";
            details += cred.revocationReason
              ? ` (Reason: ${cred.revocationReason})`
              : '';
            if (cred.replacedByTokenId) {
              details += ` (Replaced by Token: ${cred.replacedByTokenId})`;
            }
          }
          activities.push({
            ...cred,
            dateTime: formatDateTime(cred.updatedAt),
            user: cred.issuer,
            details,
            firstName: cred.firstName,
            lastName: cred.lastName,
            status,
          });
        }
        setRows(activities);
        setLoading(false);
      });
  }, [refreshCount, refresh, page]);

  // Fetch total count (on mount and every data change)
  const fetchTotalCount = async () => {
    const result = await client.query(COUNT_QUERY, {}, { requestPolicy: "network-only" }).toPromise();
    if (result.data && result.data.credentials) {
      setTotal(result.data.credentials.length);
    }
  };

  useEffect(() => {
    fetchTotalCount();
  }, [refreshCount, refresh]);

  // Optional: If page > maxPage after count updates (eg. on delete), fix it.
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (page > maxPage) setPage(maxPage);
  }, [page, total]);

  // Filter logic (applies only to loaded page)
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

  // --- REVOKE logic ---
  async function handleRevoke(credential: CredentialActivity) {
    const reason = prompt("Enter revocation reason:");
    if (!reason) return;
    setLoading(true);

    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        setLoading(false);
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, IskoChainCredentialABI, signer);

      const tx = await contract.revokeCredential(credential.tokenId, reason);
      await tx.wait();

      // --- Wait for subgraph to reflect ---
      const found = await waitForSubgraphStatus(credential.tokenId, "revoked", 15000);
      if (found) {
        alert("Credential revoked and subgraph updated!");
        setRefresh(x => x + 1);
      } else {
        alert("Revoked on-chain, but subgraph did not index in time. It will appear soon.");
        setTimeout(() => setRefresh(x => x + 1), 2000);
      }
    } catch (e: any) {
      alert("Revocation failed: " + (e?.reason || e?.message));
      console.error(e);
    }
    setLoading(false);
  }

  // --- REISSUE logic ---
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
      const metaRes = await fetch(`${API_URL}/credentials/issue`, {
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

      // 2. Call contract (on-chain)
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
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

      // --- Wait for subgraph to reflect ---
      const found = await waitForSubgraphStatus(modalCredential?.tokenId!, "revoked", 15000);
      if (found) {
        alert("Credential reissued (revoked old) and subgraph updated!");
        setModalOpen(false);
        setModalCredential(null);
        setRefresh(x => x + 1);
      } else {
        alert("Reissued on-chain, but subgraph did not index in time. It will appear soon.");
        setModalOpen(false);
        setModalCredential(null);
        setTimeout(() => setRefresh(x => x + 1), 2000);
      }
    } catch (e: any) {
      alert("Reissue failed: " + (e?.reason || e?.message));
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
        <div style={{ textAlign: "center", padding: 24 }}>Loading...</div>
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
                          onClick={() => handleRevoke(activity)}
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

      {/* Modal for Reissue */}
      {modalOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
        }}>
          <form
            onSubmit={handleReissueSubmit}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 28,
              minWidth: 340,
              boxShadow: "0 8px 32px #0003",
              position: "relative"
            }}
          >
            <h3 style={{ marginBottom: 14 }}>Reissue Credential</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label>
                Credential Type
                <input
                  value={form.credentialType}
                  onChange={e => setForm((f) => ({ ...f, credentialType: e.target.value }))}
                  required
                  style={{ width: "100%", borderRadius: 6, border: "1px solid #ddd", padding: 6 }}
                />
              </label>
              <label>
                Credential Details
                <input
                  value={form.credentialDetails}
                  onChange={e => setForm((f) => ({ ...f, credentialDetails: e.target.value }))}
                  required
                  style={{ width: "100%", borderRadius: 6, border: "1px solid #ddd", padding: 6 }}
                />
              </label>
              <label>
                Issue Date
                <input
                  type="date"
                  value={form.issueDate}
                  onChange={e => setForm((f) => ({ ...f, issueDate: e.target.value }))}
                  required
                  style={{ width: "100%", borderRadius: 6, border: "1px solid #ddd", padding: 6 }}
                />
              </label>
              <label>
                Additional Metadata
                <input
                  value={form.additionalInfo || ""}
                  onChange={e => setForm((f) => ({ ...f, additionalInfo: e.target.value }))}
                  style={{ width: "100%", borderRadius: 6, border: "1px solid #ddd", padding: 6 }}
                  placeholder="Optional"
                />
              </label>
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  background: "#eee", color: "#222", padding: "7px 18px", borderRadius: 8,
                  border: "none", cursor: "pointer", fontWeight: 500
                }}
                disabled={submitting}
              >Cancel</button>
              <button
                type="submit"
                style={{
                  background: "#388e3c", color: "#fff", padding: "7px 18px", borderRadius: 8,
                  border: "none", cursor: "pointer", fontWeight: 600
                }}
                disabled={submitting}
              >Reissue</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
