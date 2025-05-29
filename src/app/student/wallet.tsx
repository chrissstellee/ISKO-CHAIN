

export default function BlockchainWallet() {
    const credentials = [
        {
            id: '#FC293A2',
            type: 'Degree',
            date: 'May 15, 2023',
            status: 'Verified',
        },
        {
            id: '#BC123D7',
            type: 'Award',
            date: 'March 10, 2023',
            status: 'Verified',
        },
        {
            id: '#XY456Z8',
            type: 'Certificate',
            date: 'January 5, 2024',
            status: 'Invalid',
        },
    ];

    // Determine chip class based on status
    const getStatusChipClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'verified':
                return 'chip success';
            case 'invalid':
                return 'chip error';
            default:
                return 'chip default';
        }
    };

    return (
        <div className="card">
            <h2 className="card-title">My Blockchain Wallet</h2>

            <div className="wallet-credentials">
                <p className="wallet-title">Your Secure Credential Wallet</p>
                <div className="wallet-address">0x8F42DaCbB4a8763a6a81daB2133aD78FB9eFB5ED</div>
                <div className="wallet-verified">3 Verified Credentials</div>
            </div>

            <div className="student-table-container">
                <table className="activity-table">
                    <thead>
                        <tr>
                            <th>Credential ID</th>
                            <th>Type</th>
                            <th>Issue Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {credentials.map((cred) => (
                            <tr key={cred.id}>
                                <td>{cred.id}</td>
                                <td>{cred.type}</td>
                                <td>{cred.date}</td>
                                <td className="status-cell">
                                    <span className={getStatusChipClass(cred.status)}>
                                        {cred.status === 'Verified' ? 'Verified' : 'Invalid'}
                                    </span>
                                </td>
                                <td>
                                    <button className="view-button">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>



        </div>
    );
};