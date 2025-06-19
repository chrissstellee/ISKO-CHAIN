'use client';

import Navbar from '@/components/navbar';
import CredentialForm from '@/components/form/credential-form';
import RecentActivity from "@/components/recent-activity";
import Dashboard from '@/app/admin/dashboard';
import AddUserForm from '@/components/form/add-user-form';
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

import '@/styles/card.css';
import '@/styles/text.css';
import '@/styles/button.css';
import '@/styles/admin.css';
import '@/styles/inputs.css';
import '@/styles/table.css';
import '@/styles/chip.css';

export default function Admin() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Shared refresh counter for activity and dashboard
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    if (!isConnected || !address) {
      router.replace('/');
      return;
    }
    fetch(`http://localhost:3001/users/get-role?walletAddress=${address}`)
      .then(res => res.json())
      .then(data => {
        if (!data.role || data.role !== 'admin') {
          router.replace('/');
        } else {
          setCheckingAuth(false);
        }
      })
      .catch(() => {
        router.replace('/');
      });
  }, [isConnected, address, router]);

  // Call this after *any* action that changes dashboard/activity data
  const handleRefresh = useCallback(() => {
    setRefreshCount(c => c + 1);
  }, []);

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
        <h1 className="page-title">Admin Dashboard</h1>
        {/* Pass refreshCount to both Dashboard and RecentActivity */}
        <Dashboard refreshCount={refreshCount} />
        <RecentActivity refreshCount={refreshCount} onAnyAction={handleRefresh} />
        <CredentialForm onIssueSuccess={handleRefresh} />
        <AddUserForm />
      </div>
    </div>
  );
}
