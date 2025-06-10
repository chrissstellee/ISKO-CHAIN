'use client';

import Image from 'next/image';
import Link from 'next/link';
import '@/styles/landing-style.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import React from "react";
import { useRouter } from "next/navigation";


export default function LandingPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push("/student");
    }
  }, [isConnected, router]);

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

        {/* ✅ No Link needed — use effect handles routing after connect */}
        <ConnectButton showBalance={false} />
      </div>

      <div className="landing-bar" /> 
    </div>
  );
}
