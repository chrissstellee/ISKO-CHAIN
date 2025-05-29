import React from "react";
import "@/components/navbar";
import "@/styles/navbar.css"

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <img src="/favicon.svg" alt="Logo" className="logo" />
                <span className="title">PUPQCHAIN</span>
            </div>
        </nav>
    );
}