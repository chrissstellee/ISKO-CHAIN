import Image from 'next/image';
import Link from 'next/link';
import '@/styles/landing-style.css';

export default function LandingPage() {
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

        <h1 className="landing-title">PUPQCHAIN</h1>
        <p className="landing-description">
          Blockchain-Based Academic Credential Verification System
        </p>

        <Link href="/student">
          <button className="connect-button">Connect Wallet</button>
        </Link>
      </div>

      <div className="landing-bar" /> 
    </div>
  );
}
