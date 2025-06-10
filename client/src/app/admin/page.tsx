'use client';

import Navbar from '@/components/navbar';
import CredentialForm from '@/components/form/credential-form';
import RecentActivity from '@/app/admin/recent-activity';
import Dashboard from '@/app/admin/dashboard';
import AddUserForm from '@/components/form/add-user-form';


import '@/styles/card.css';
import '@/styles/text.css';
import '@/styles/button.css';
import '@/styles/admin.css';
import '@/styles/inputs.css';
import '@/styles/table.css';
import '@/styles/chip.css';

const activityData = [
  {
    dateTime: "May 19, 2025 10:23 AM",
    action: "Issue Credential",
    user: "admin@pup.edu.ph",
    details: "BS Computer Science - 35 students",
    status: "Completed",
  },
  {
    dateTime: "May 19, 2025 09:45 AM",
    action: "Revoke Credential",
    user: "dean@pup.edu.ph",
    details: "Token ID: #AB123C7",
    status: "Completed",
  },
  {
    dateTime: "May 18, 2025 04:12 PM",
    action: "Batch Upload",
    user: "registrar@pup.edu.ph",
    details: "Workshop Certificates - 120 students",
    status: "Processing",
  },
  {
    dateTime: "May 18, 2025 02:30 PM",
    action: "System Update",
    user: "system",
    details: "Smart Contract V2 Deployment",
    status: "Invalid",
  },
];

export default function Admin() {
  return (
    <div>
      <Navbar />
      <div className="screen-container">
        <h1 className="page-title">Admin Dashboard</h1>
        
        {/* Dashboard Stats Component */}
        <Dashboard />

        {/* Issue Credential Form Component */}
        <CredentialForm />

        {/* Add User Form for Admins */}
        <AddUserForm />
        
        {/* Recent Activity */}
        <RecentActivity activityData={activityData} />
      </div>
    </div>
  );
}
