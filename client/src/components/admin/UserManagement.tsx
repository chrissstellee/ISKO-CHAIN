/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import React, { useState, useEffect } from "react";
import AddUserForm from "@/components/form/add-user-form";
import { useAccount } from "wagmi";
import MySwal from "@/lib/swal"; // SuiteAlert wrapper


interface Program {
  id: number;
  name: string;
  abbreviation: string;
}
interface User {
  id: number;
  walletAddress: string;
  role: "admin" | "student";
  email?: string;
  studentId?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  yearLevel?: number;
  programId?: number;
  program?: Program;
}
const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function UserManagement() {
  // Tabs: "students" or "admins"
  const [tab, setTab] = useState<"student" | "admin">("student");
  const [users, setUsers] = useState<User[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [total, setTotal] = useState(0);;
  const [filterProgramId, setFilterProgramId] = useState<number | "">("");
  // Editing modal states
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const { address } = useAccount(); // Or however you get wallet address

  // Fetch programs for filtering and student editing
  useEffect(() => {
    if (tab === "student") {
      fetch("http://localhost:3001/programs")
        .then(res => res.json())
        .then(setPrograms)
        .catch(() => setPrograms([]));
    }
  }, [tab]);

  // Fetch users on tab/search/page/size/filter change
  useEffect(() => {
    fetchUsers();
    
    // eslint-disable-next-line
  }, [tab, search, currentPage, pageSize, filterProgramId]);

  useEffect(() => {
  if (address) {
    fetch(`http://localhost:3001/users/is-superadmin?walletAddress=${address}`)
      .then(res => res.json())
      .then(data => setIsSuperadmin(Boolean(data.isSuperadmin)))
      .catch(() => setIsSuperadmin(false));
  } else {
    setIsSuperadmin(false);
  }
 }, [address]);

    async function fetchUsers() {
    setLoading(true);
    try {
        const params = new URLSearchParams({
        role: tab,
        search,
        page: String(currentPage),
        pageSize: String(pageSize),
        });
        if (tab === "student" && filterProgramId) {
        params.append("programId", String(filterProgramId));
        }
        const res = await fetch(`http://localhost:3001/users?${params.toString()}`);
        const data = await res.json();

        // Defensive: handle either array or object with .users
        if (Array.isArray(data)) {
        setUsers(data);
        setTotal(data.length);
        } else {
        setUsers(Array.isArray(data.users) ? data.users : []);
        setTotal(Number.isFinite(data.total) ? data.total : (data.users?.length || 0));
        }
    } catch {
        setUsers([]);
        setTotal(0);
    }
    setLoading(false);
    }


  // Handle edit user
  function openEditModal(user: User) {
    setEditUser(user);
    setEditForm({
      ...user,
      programId: user.programId || user.program?.id || undefined,
    });
    setModalOpen(true);
  }

  async function handleEditSave(e: React.FormEvent) {
    e.preventDefault();
    setModalLoading(true);
    try {
      let endpoint = `http://localhost:3001/users/${editUser?.id}`;
      let method = "PUT";
      let body: any = {};
      if (editUser?.role === "admin") {
        body.email = editForm.email;
      } else {
        body = {
          firstName: editForm.firstName,
          middleName: editForm.middleName,
          lastName: editForm.lastName,
          yearLevel: editForm.yearLevel,
          studentId: editForm.studentId,
          programId: editForm.programId,
        };
      }
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        await MySwal.fire({
          icon: "success",
          title: "Update Successful",
          text: "User info updated.",
          confirmButtonColor: "#b71c1c"
        });
        setModalOpen(false);
        setEditUser(null);
        fetchUsers();
      } else {
        await MySwal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Could not update user info.",
          confirmButtonColor: "#b71c1c"
        });
      }
    } finally {
      setModalLoading(false);
    }
  }

  // Handle delete user
  async function handleDeleteUser(user: User) {
    const result = await MySwal.fire({
      icon: "warning",
      title: "Delete User?",
      text: `Are you sure you want to delete this user (${user.role === "admin" ? user.email : user.studentId})?`,
      showCancelButton: true,
      confirmButtonColor: "#b71c1c",
      cancelButtonColor: "#666",
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;
    await fetch(`http://localhost:3001/users/${user.id}`, { method: "DELETE" });
    await MySwal.fire({
      icon: "success",
      title: "Deleted",
      text: "User deleted.",
      confirmButtonColor: "#b71c1c"
    });
    fetchUsers();
  }

  // Table columns
  function renderTable() {
    if (tab === "admin") {
      return (
        <table className="user-table">
          <thead>
            <tr>
              <th>Wallet Address</th>
              <th>Email</th>
              <th style={{ width: 100 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.walletAddress}</td>
                <td>{admin.email}</td>
                <td>
                    <button onClick={() => openEditModal(admin)} style={actionBtnStyle}>✏️</button>
                    {isSuperadmin && admin.walletAddress !== address && (
                        <button onClick={() => handleDeleteUser(admin)} style={deleteBtnStyle}>🗑️</button>
                    )}
                </td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr><td colSpan={3} style={{ textAlign: "center" }}>No admins found.</td></tr>
            )}
          </tbody>
        </table>
      );
    }
    // Students
    return (
      <table className="user-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Full Name</th>
            <th>Year</th>
            <th>Program</th>
            <th>Wallet Address</th>
            <th style={{ width: 100 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((stud) => (
            <tr key={stud.id}>
              <td>{stud.studentId}</td>
              <td>{[stud.lastName, stud.firstName, stud.middleName].filter(Boolean).join(", ")}</td>
              <td>{stud.yearLevel}</td>
              <td>{stud.program?.name || ""}</td>
              <td>{stud.walletAddress}</td>
              <td>
                <button onClick={() => openEditModal(stud)} style={actionBtnStyle}>✏️</button>
                <button onClick={() => handleDeleteUser(stud)} style={deleteBtnStyle}>🗑️</button>
              </td>
            </tr>
          ))}
          {!loading && users.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: "center" }}>No students found.</td></tr>
          )}
        </tbody>
      </table>
    );
  }

  // Filtering UI for students
  function renderFilters() {
    if (tab !== "student") return null;
    return (
      <select
        value={filterProgramId}
        onChange={e => {
          setFilterProgramId(e.target.value === "" ? "" : Number(e.target.value));
          setCurrentPage(1);
        }}
        style={{ borderRadius: 7, padding: 8, border: "1px solid #e0e0e0", minWidth: 120 }}
      >
        <option value="">All Programs</option>
        {programs.map(p => (
          <option value={p.id} key={p.id}>{p.name}</option>
        ))}
      </select>
    );
  }

  // Modal for editing users
  function renderEditModal() {
    if (!modalOpen || !editUser) return null;
    return (
      <div style={modalBackdropStyle}>
        <form
          onSubmit={handleEditSave}
          style={{
            ...modalStyle,
            minWidth: 350,
          }}>
          <h3 style={{ marginBottom: 10 }}>Edit {editUser.role === "admin" ? "Admin" : "Student"}</h3>
          {editUser.role === "admin" ? (
            <>
              <label>Email</label>
              <input
                type="email"
                value={editForm.email || ""}
                required
                onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                style={inputStyle}
              />
            </>
          ) : (
            <>
              <label>Student ID</label>
              <input
                type="text"
                value={editForm.studentId || ""}
                required
                onChange={e => setEditForm(f => ({ ...f, studentId: e.target.value }))}
                style={inputStyle}
              />
              <label>First Name</label>
              <input
                type="text"
                value={editForm.firstName || ""}
                required
                onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))}
                style={inputStyle}
              />
              <label>Middle Name</label>
              <input
                type="text"
                value={editForm.middleName || ""}
                onChange={e => setEditForm(f => ({ ...f, middleName: e.target.value }))}
                style={inputStyle}
              />
              <label>Last Name</label>
              <input
                type="text"
                value={editForm.lastName || ""}
                required
                onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))}
                style={inputStyle}
              />
              <label>Year Level</label>
              <input
                type="number"
                min={1}
                max={5}
                value={editForm.yearLevel || ""}
                required
                onChange={e => setEditForm(f => ({ ...f, yearLevel: Number(e.target.value) }))}
                style={inputStyle}
              />
              <label>Program</label>
              <select
                value={editForm.programId || ""}
                onChange={e => setEditForm(f => ({ ...f, programId: Number(e.target.value) }))}
                style={inputStyle}
                required
              >
                <option value="">-- Select Program --</option>
                {programs.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </>
          )}
          <div style={{ marginTop: 18, display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button type="button"
              onClick={() => setModalOpen(false)}
              disabled={modalLoading}
              style={{
                background: "#eee", color: "#222", padding: "7px 18px", borderRadius: 8,
                border: "none", cursor: "pointer", fontWeight: 500
              }}>Cancel</button>
            <button type="submit"
              disabled={modalLoading}
              style={{
                background: "#388e3c", color: "#fff", padding: "7px 18px", borderRadius: 8,
                border: "none", cursor: "pointer", fontWeight: 600
              }}>{modalLoading ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="card">
      <AddUserForm onUserAdded={fetchUsers} />
      <h2 className="card-title">User Management</h2>
      <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
        <button
          className={tab === "student" ? "tab-active" : "tab"}
          onClick={() => { setTab("student"); setCurrentPage(1); }}>
          Students
        </button>
        <button
          className={tab === "admin" ? "tab-active" : "tab"}
          onClick={() => { setTab("admin"); setCurrentPage(1); }}>
          Admins
        </button>
        {/* Only show for students */}
        {renderFilters()}
        <input
          type="text"
          placeholder={`Search by ${tab === "admin" ? "email/wallet" : "name/student ID/wallet"}`}
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 7,
            border: "1px solid #e0e0e0",
            marginLeft: "auto"
          }}
        />
        <select
          value={pageSize}
          onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
          style={{
            padding: 8,
            borderRadius: 7,
            border: "1px solid #e0e0e0"
          }}
        >
          {PAGE_SIZE_OPTIONS.map(n => (
            <option key={n} value={n}>{n} / page</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 28 }}>Loading users...</div>
      ) : renderTable()}

      {/* Pagination controls */}
      <div style={{
        display: "flex",
        gap: 16,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 18
      }}>
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          style={{ padding: "6px 18px", borderRadius: 7, border: "1px solid #eee" }}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.max(1, Math.ceil(total / pageSize))} ({total} total)
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(Math.ceil(total / pageSize), p + 1))}
          disabled={currentPage === Math.ceil(total / pageSize)}
          style={{ padding: "6px 18px", borderRadius: 7, border: "1px solid #eee" }}
        >
          Next
        </button>
      </div>
      {renderEditModal()}
      <style>{`
        .user-table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          margin-top: 8px;
        }
        .user-table th, .user-table td {
          border: 1px solid #e0e0e0;
          padding: 10px 12px;
          text-align: left;
        }
        .user-table th {
          background: #f5f5f5;
          font-weight: 600;
        }
        .user-table tr:nth-child(even) {
          background: #fafafa;
        }
        .user-table tr:hover {
          background: #f1f6ff;
        }
        .tab, .tab-active {
          padding: 6px 18px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #f4f4f4;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .tab-active {
          background: #b71c1c;
          color: #fff;
          border-color: #b71c1c;
        }
      `}</style>
    </div>
  );
}

// --- Inline styles for small elements ---
const actionBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  fontSize: 18,
  cursor: "pointer",
  marginRight: 10,
};
const deleteBtnStyle: React.CSSProperties = {
  ...actionBtnStyle,
  color: "#b71c1c"
};
const modalBackdropStyle: React.CSSProperties = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(20,20,20,0.13)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100,
};
const modalStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  padding: 28,
  minWidth: 320,
  boxShadow: "0 8px 32px #0002",
  position: "relative"
};
const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 6,
  border: "1px solid #ddd",
  padding: 7,
  marginBottom: 10
};
