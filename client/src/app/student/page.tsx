/* eslint-disable @typescript-eslint/no-explicit-any */

// client/src/app/student/page.tsx
"use client";
import Navbar from '@/components/navbar';
import StudentWallet from '@/app/student/wallet';
import ShareCredentials from '@/app/student/share';
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { createClient, gql } from "urql";
import { cacheExchange, fetchExchange } from "@urql/core";

// Styles
import '@/styles/card.css';
import '@/styles/text.css';
import '@/styles/button.css';
import '@/styles/admin.css';
import '@/styles/inputs.css';
import '@/styles/table.css';
import '@/styles/chip.css';
import "@/styles/student.css";
import "@/styles/share.css";

const SUBGRAPH_URL = "https://api.studio.thegraph.com/query/113934/isko-chain/version/latest";
const client = createClient({
  url: SUBGRAPH_URL,
  exchanges: [cacheExchange, fetchExchange],
});
const CREDENTIALS_QUERY = gql`
  query CredentialsByOwner($owner: Bytes!) {
    credentials(where: { owner: $owner }, orderBy: createdAt, orderDirection: desc) {
      credentialCode
      credentialType
      credentialDetails
      firstName
      lastName
      issueDate
      tokenId
      tokenURI
      owner
    }
  }
`;

export default function Student() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // 1. If not connected, redirect to landing
    if (!isConnected || !address) {
      router.replace('/');
      return;
    }
    // 2. Check if registered as student
    fetch(`http://localhost:3001/users/get-role?walletAddress=${address}`)
      .then(res => res.json())
      .then(data => {
        if (!data.role || data.role !== 'student') {
          router.replace('/'); // Not registered as student
        } else {
          setCheckingAuth(false); // OK!
        }
      })
      .catch(() => {
        router.replace('/'); // On error, redirect for safety
      });
  }, [isConnected, address, router]);

  // Only fetch credentials if passed auth guard
  useEffect(() => {
    if (!address || checkingAuth) return;
    setLoading(true);
    client
      .query(CREDENTIALS_QUERY, { owner: address.toLowerCase() })
      .toPromise()
      .then((result) => {
        setCredentials(result.data?.credentials || []);
      })
      .catch((err) => {
        setCredentials([]);
        console.error("Failed to fetch credentials", err);
      })
      .finally(() => setLoading(false));
  }, [address, checkingAuth]);

  if (checkingAuth) {
    return (
      <>
        <Navbar />
        <div style={{ marginTop: 64, textAlign: "center" }}>Checking access...</div>
      </>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="screen-container">
        <h1 className="page-title">Student View</h1>
        <StudentWallet credentials={credentials} loading={loading} />
        <ShareCredentials credentials={credentials} loading={loading} />
      </div>
    </div>
  );
}
