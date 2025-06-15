/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";

export default function AddUserForm() {
  const [walletAddress, setWalletAddress] = useState('');
  const [studentId, setStudentId] = useState('');
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [programId, setProgramId] = useState<number | ''>('');
  const [programs, setPrograms] = useState<{id: number; name: string; abbreviation: string;}[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch program list on mount
  useEffect(() => {
    if (role !== 'student') return; // Only fetch when relevant
    fetch('http://localhost:3001/programs')
      .then(res => res.json())
      .then(data => setPrograms(data))
      .catch(() => setPrograms([]));
  }, [role]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    const payload: any = {
      walletAddress,
      role,
    };

    if (role === "student") {
      payload.studentId = studentId;
      payload.firstName = firstName;
      payload.middleName = middleName || undefined;
      payload.lastName = lastName;
      payload.yearLevel = yearLevel ? Number(yearLevel) : undefined;
      payload.programId = programId !== '' ? Number(programId) : undefined;
    }

    if (role === "admin") {
      payload.email = email;
    }

    const res = await fetch('http://localhost:3001/users/bind-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) setSuccess('✅ User added!');
    else setSuccess('❌ Failed to add user.');

    setLoading(false);
    setWalletAddress('');
    setStudentId('');
    setRole('student');
    setEmail('');
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setYearLevel('');
    setProgramId('');
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
          <>
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
            <label style={{ fontWeight: 500 }}>
              First Name
              <input
                className="input"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                placeholder="e.g. Juan"
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
            <label style={{ fontWeight: 500 }}>
              Middle Name (optional)
              <input
                className="input"
                value={middleName}
                onChange={e => setMiddleName(e.target.value)}
                placeholder="e.g. Santos"
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
            <label style={{ fontWeight: 500 }}>
              Last Name
              <input
                className="input"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                placeholder="e.g. Dela Cruz"
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
            <label style={{ fontWeight: 500 }}>
              Year Level
              <input
                type="number"
                min={1}
                max={5}
                className="input"
                value={yearLevel}
                onChange={e => setYearLevel(e.target.value)}
                required
                placeholder="e.g. 1"
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
            <label style={{ fontWeight: 500 }}>
              Program
              <select
                className="input"
                value={programId}
                onChange={e => setProgramId(Number(e.target.value))}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  marginTop: 6,
                  fontSize: 15,
                  background: programs.length ? "#fff" : "#f9f9f9"
                }}
              >
                <option value="">-- Select Program --</option>
                {programs.map(program => (
                  <option key={program.id} value={program.id}>
                    {program.name} ({program.abbreviation})
                  </option>
                ))}
              </select>
            </label>
          </>
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
