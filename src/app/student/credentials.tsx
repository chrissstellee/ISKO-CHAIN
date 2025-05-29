import React from 'react';
import '@/styles/credentials.css';

interface Credential {
    title: string;
    date: string;
    id: string;
}

const credentials: Credential[] = [
    {
        title: 'Bachelor of Science in Computer Science',
        date: 'May 15, 2023',
        id: '#FC293A2',
    },
    {
        title: 'Academic Excellence Award',
        date: 'March 10, 2023',
        id: '#BC123D7',
    },
    {
        title: 'Hackathon Winner Certificate',
        date: 'January 22, 2023',
        id: '#AD982F1',
    },
];

export default function Credentials() {
    return (
        <div className="card">
            <h2 className="card-title">My Credentials</h2>
            {credentials.map((cred, index) => (
                <div className="student-credential-box" key={index}>
                    <div className="student-credential-info">

                        <div>
                            <h3 className="student-credential-title">{cred.title}</h3>
                            <p className="student-credential-meta">
                                Issued: {cred.date} • Token ID: {cred.id}
                            </p>
                            <p className="student-verified-text">✓ Blockchain Verified</p>
                        </div>
                    </div>

                    <div className="share">
                        <button className="share-button">
                            <i className="ri-share-forward-fill"></i>
                            <span className="share-label">Share</span>
                        </button>
                    </div>

                </div>
            ))}
        </div>
    );
}
