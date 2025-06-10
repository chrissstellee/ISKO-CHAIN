'use client';
import React from "react";
import "@/components/navbar";
import "@/styles/navbar.css"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';


export default function Navbar() {
    const { isConnected } = useAccount();
    const router = useRouter();

    useEffect(() => {
        // If user disconnects, redirect to homepage
        if (!isConnected) {
        router.push('/');
        }
    }, [isConnected, router]);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <img src="/favicon.svg" alt="Logo" className="logo" />
                <span className="title">ISKO-CHAIN</span>
            </div>
            {/* RainbowKit Wallet Connect / Disconnect Button */}
            <ConnectButton showBalance={false} />
        </nav>  
    );
}