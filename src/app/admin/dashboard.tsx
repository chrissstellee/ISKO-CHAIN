'use client';

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  return (
    <div className="card-row">
      {/* Quick Stats */}
      <div className="card quick-stats-card">
        <h2 className="card-title">Quick Stats</h2>
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-number">2,458</div>
            <div className="stat-label">Total Credentials Issued</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">186</div>
            <div className="stat-label">Credentials Issued This Month</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">1,423</div>
            <div className="stat-label">Verification Requests</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">42</div>
            <div className="stat-label">Pending Approvals</div>
          </div>
        </div>
      </div>

    </div>
  );
}
