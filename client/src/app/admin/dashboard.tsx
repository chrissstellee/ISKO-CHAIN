/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from "react";
import { createClient, gql } from "urql";
import { cacheExchange, fetchExchange } from "@urql/core";
import BlockchainTableLoader from "@/components/ui/loading";

const SUBGRAPH_URL = "https://api.studio.thegraph.com/query/113934/isko-chain/version/latest";
const client = createClient({
  url: SUBGRAPH_URL,
  exchanges: [cacheExchange, fetchExchange],
});

const DASHBOARD_QUERY = gql`
  query DashboardStats($monthStart: BigInt!) {
    total: credentials {
      id
    }
    thisMonth: credentials(where: { issueDate_gte: $monthStart }) {
      id
    }
    revoked: credentials(where: { status: "revoked" }) {
      id
      replacedByTokenId
    }
  }
`;

interface DashboardProps {
  refreshCount?: number;
}

export default function Dashboard({ refreshCount = 0 }: DashboardProps) {
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    revoked: 0,
    reissued: 0,
    loading: true,
  });

  function getMonthStartTimestamp() {
    const now = new Date();
    return Math.floor(new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000);
  }

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      setStats(s => ({ ...s, loading: true }));
      const { data } = await client
        .query(DASHBOARD_QUERY, { monthStart: getMonthStartTimestamp() }, { requestPolicy: "network-only" })
        .toPromise();

      if (!cancelled) {
        const revokedCreds = data?.revoked || [];
        const revokedCount = revokedCreds.length;
        // Count revoked creds with a non-empty replacedByTokenId as "Reissued"
        const reissuedCount = revokedCreds.filter((c: any) => c.replacedByTokenId && c.replacedByTokenId !== "").length;

        setStats({
          total: data?.total?.length || 0,
          thisMonth: data?.thisMonth?.length || 0,
          revoked: revokedCount,
          reissued: reissuedCount,
          loading: false,
        });
      }
    }

    fetchStats();
    return () => { cancelled = true; };
  }, [refreshCount]);

  return (
    <div className="card-row">
      <div className="card quick-stats-card">
        <h2 className="card-title">Quick Stats</h2>
        {stats.loading ? (
          <BlockchainTableLoader size="md" message="Loading dashboard..." />
        ) : (
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Credentials Issued</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{stats.thisMonth}</div>
              <div className="stat-label">Issued This Month</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{stats.revoked}</div>
              <div className="stat-label">Revoked</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{stats.reissued}</div>
              <div className="stat-label">Reissued</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
