'use client';

import Image from 'next/image';
import '@/styles/landing-style.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  const [checkingRole, setCheckingRole] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      setCheckingRole(true);
      // Call your backend API to get role
      fetch(`http://localhost:3001/users/get-role?walletAddress=${address}`)
        .then(res => res.json())
        .then(data => {
          setCheckingRole(false);
          if (!data.role) {
            setShowRegistration(true); // User not found, show registration
          } else if (data.role === 'student') {
            router.push('/student');
          } else if (data.role === 'admin') {
            router.push('/admin');
          } else if (data.role === 'employer') {
            router.push('/verifier');
          }
        })
        .catch(() => setCheckingRole(false));
    }
  }, [isConnected, address, router]);

  // Registration Modal Placeholder (simple for now)
  function RegistrationModal() {
    return (
      <div className="modal">
        <h2>Register Your Wallet</h2>
        <p>This wallet is not yet registered. Please sign up as a student, admin, or employer.</p>
        {/* You can build a form here to POST to /users/bind-wallet */}
      </div>
    );
  }

  return (
    <div className="landing-container">
      <div className="landing-bar" /> 

      <div className="landing-card">
        <Image
          src="/favicon.svg"
          alt="PUP Logo"
          width={400}
          height={400}
          className="landing-logo"
        />

        <h1 className="landing-title">ISKO-CHAIN</h1>
        <p className="landing-description">
          Blockchain-Based Academic Credential Verification System
        </p>

        <ConnectButton showBalance={false} />

        {checkingRole && <div style={{ marginTop: 12 }}>Checking user role...</div>}
        {showRegistration && <RegistrationModal />}
      </div>

      <div className="landing-bar" /> 
    </div>
  );
}
