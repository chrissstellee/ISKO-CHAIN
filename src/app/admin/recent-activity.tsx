'use client';

interface Activity {
  dateTime: string;
  action: string;
  user: string;
  details: string;
  status: string;
}

interface RecentActivityProps {
  activityData: Activity[];
}

const getStatusClass = (status: string) => {
  switch (status) {
    case "Completed":
      return "chip success";
    case "Processing":
      return "chip process";
    case "Invalid":
      return "chip error";
    default:
      return "chip default";
  }
};

export default function RecentActivity({ activityData }: RecentActivityProps) {
  return (
    <div className="card">
      <h2 className="card-title">Recent Activity</h2>
      <table className="activity-table">
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Action</th>
            <th>User</th>
            <th>Details</th>
            <th className="status-cell">Status</th>
          </tr>
        </thead>
        <tbody>
          {activityData.map((activity, index) => (
            <tr key={index}>
              <td>{activity.dateTime}</td>
              <td>{activity.action}</td>
              <td>{activity.user}</td>
              <td>{activity.details}</td>
              <td className="status-cell">
                <span className={getStatusClass(activity.status)}>
                  {activity.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
