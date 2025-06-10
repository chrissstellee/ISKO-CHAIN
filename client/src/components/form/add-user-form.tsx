import React, { useState } from "react";

export default function AddUserForm() {
  const [walletAddress, setWalletAddress] = useState('');
  const [studentId, setStudentId] = useState('');
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    const res = await fetch('http://localhost:3001/users/bind-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walletAddress,
        studentId: role === 'student' ? studentId : undefined,
        role,
        email: role === 'admin' ? email : undefined, // Only send email if admin
      }),
    });
    if (res.ok) setSuccess('✅ User added!');
    else setSuccess('❌ Failed to add user.');
    setLoading(false);
    setWalletAddress('');
    setStudentId('');
    setRole('student');
    setEmail('');
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: "24px auto" }}>
      <h2 className="card-title" style={{ marginBottom: 12 }}>Add User</h2>
      <form
        onSubmit={handleAddUser}
        className="add-user-form"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <label style={{ fontWeight: 500 }}>
          Wallet Address
          <input
            className="input"
            value={walletAddress}
            onChange={e => setWalletAddress(e.target.value)}
            required
            placeholder="0x..."
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              marginTop: 6,
              fontSize: 15,
            }}
          />
        </label>

        {role === "student" && (
          <label style={{ fontWeight: 500 }}>
            Student Number
            <input
              className="input"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              required
              placeholder="e.g. 202112345"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                marginTop: 6,
                fontSize: 15,
              }}
            />
          </label>
        )}

        {role === "admin" && (
          <label style={{ fontWeight: 500 }}>
            Email
            <input
              type="email"
              className="input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required={role === "admin"}
              placeholder="e.g. admin@pup.edu.ph"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                marginTop: 6,
                fontSize: 15,
              }}
            />
          </label>
        )}

        <label style={{ fontWeight: 500 }}>
          Role
          <select
            className="input"
            value={role}
            onChange={e => setRole(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              marginTop: 6,
              fontSize: 15,
            }}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
            <option value="employer">Employer</option>
          </select>
        </label>
        
        <button
          type="submit"
          className="btn"
          disabled={loading || (role === 'admin' && !email)}
          style={{
            marginTop: 12,
            padding: "10px 0",
            borderRadius: "8px",
            fontWeight: 600,
            background: "#b71c1c",
            color: "white",
            border: "none",
            fontSize: 16,
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 2px 8px 0 rgba(183, 28, 28, 0.07)",
            transition: "background 0.2s",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Adding..." : "Add User"}
        </button>
      </form>
      {success && (
        <div
          style={{
            marginTop: 16,
            textAlign: "center",
            color: success.startsWith("✅") ? "#388e3c" : "#b71c1c",
            fontWeight: 500,
            fontSize: 15,
          }}
        >
          {success}
        </div>
      )}
    </div>
  );
}
