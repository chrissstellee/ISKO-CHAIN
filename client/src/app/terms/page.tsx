/* eslint-disable react/no-unescaped-entities */
// client/src/app/terms/page.tsx
'use client';
import React from 'react';
import Navbar from "@/components/navbar";

export default function TermsPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white-50 to-khaki-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms & Conditions
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully before using the ISKO-CHAIN platform
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-12">
              
              {/* Introduction */}
              <div className="mb-10 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                <h2 className="text-xl font-semibold text-blue-900 mb-3">
                  Welcome to ISKO-CHAIN
                </h2>
                <p className="text-blue-800 leading-relaxed">
                  ISKO-CHAIN is a blockchain-based academic credential verification system developed for the 
                  Polytechnic University of the Philippines (PUP). By accessing or using our platform, 
                  you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
              </div>

              {/* Terms Sections */}
              <div className="space-y-8">
                
                {/* Section 1 */}
                <section>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                    Acceptance of Terms
                  </h3>
                  <div className="ml-11 space-y-3 text-gray-700 leading-relaxed">
                    <p>
                      By accessing, browsing, or using the ISKO-CHAIN decentralized application (DApp), 
                      you acknowledge that you have read, understood, and agree to be legally bound by these 
                      Terms and Conditions and all applicable laws and regulations.
                    </p>
                    <p>
                      If you do not agree with any part of these terms, you must discontinue use of the platform immediately.
                    </p>
                  </div>
                </section>

                {/* Section 2 */}
                <section>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                    Platform Overview and Authorized Use
                  </h3>
                  <div className="ml-11 space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      ISKO-CHAIN provides a secure, decentralized platform for the issuance, management, 
                      and verification of academic credentials using blockchain technology.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Authorized Users:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span><strong>Students:</strong> Current and former PUP students seeking credential verification</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span><strong>Verifiers:</strong> Employers, academic institutions, and authorized third parties</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span><strong>Administrators:</strong> PUP administrative staff and authorized personnel</span>
                        </li>
                      </ul>
                    </div>
                    <p>
                      You agree to use the platform only for lawful purposes and in accordance with these terms.
                    </p>
                  </div>
                </section>

                {/* Section 3 */}
                <section>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                    User Responsibilities and Prohibited Activities
                  </h3>
                  <div className="ml-11 space-y-4 text-gray-700 leading-relaxed">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-2">You Agree To:</h4>
                        <ul className="space-y-1 text-sm text-green-700">
                          <li>• Provide accurate and truthful information</li>
                          <li>• Maintain the security of your wallet and credentials</li>
                          <li>• Use the platform responsibly and ethically</li>
                          <li>• Comply with all applicable laws and regulations</li>
                        </ul>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <h4 className="font-semibold text-red-800 mb-2">Prohibited Activities:</h4>
                        <ul className="space-y-1 text-sm text-red-700">
                          <li>• Attempting to forge or falsify credentials</li>
                          <li>• Unauthorized access to other users' data</li>
                          <li>• Interfering with platform security or functionality</li>
                          <li>• Using the platform for commercial exploitation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 4 */}
                <section>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                    Privacy, Data Protection, and Blockchain Transparency
                  </h3>
                  <div className="ml-11 space-y-4 text-gray-700 leading-relaxed">
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notice:</h4>
                      <p className="text-yellow-700 text-sm">
                        Blockchain technology ensures transparency and immutability. Once recorded, 
                        credential data cannot be deleted or modified.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p>
                        <strong>Data Collection:</strong> We collect minimal personal information necessary 
                        for credential verification and platform functionality.
                      </p>
                      <p>
                        <strong>Blockchain Records:</strong> Credential hashes and verification records 
                        are permanently stored on the blockchain and are publicly accessible.
                      </p>
                      <p>
                        <strong>Wallet Privacy:</strong> Your wallet address may be associated with your 
                        credentials but is not used for marketing or commercial purposes.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 5 */}
                <section>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                    Platform Availability and Limitations
                  </h3>
                  <div className="ml-11 space-y-3 text-gray-700 leading-relaxed">
                    <p>
                      ISKO-CHAIN is provided on an "as is" and "as available" basis. We strive to maintain 
                      high availability but cannot guarantee uninterrupted service.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Service Limitations:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Platform may experience downtime for maintenance or technical issues</li>
                        <li>• Blockchain network congestion may affect transaction processing times</li>
                        <li>• Features may be updated or modified without prior notice</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Section 6 */}
                <section>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">6</span>
                    Liability and Disclaimers
                  </h3>
                  <div className="ml-11 space-y-3 text-gray-700 leading-relaxed">
                    <p>
                      The Polytechnic University of the Philippines and ISKO-CHAIN platform operators 
                      shall not be liable for any direct, indirect, incidental, or consequential damages 
                      arising from the use of this platform.
                    </p>
                    <p>
                      Users are responsible for maintaining the security of their digital wallets and 
                      protecting their private keys. We cannot recover lost credentials or reverse 
                      blockchain transactions.
                    </p>
                  </div>
                </section>

                {/* Section 7 */}
                <section>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">7</span>
                    Modifications and Updates
                  </h3>
                  <div className="ml-11 space-y-3 text-gray-700 leading-relaxed">
                    <p>
                      We reserve the right to modify these Terms and Conditions at any time to reflect 
                      changes in our services, legal requirements, or best practices.
                    </p>
                    <p>
                      Users will be notified of significant changes through the platform or via registered 
                      contact methods. Continued use of the platform after modifications constitutes 
                      acceptance of the updated terms.
                    </p>
                  </div>
                </section>

                {/* Section 8 */}
                <section>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">8</span>
                    Contact Information
                  </h3>
                  <div className="ml-11 text-gray-700 leading-relaxed">
                    <p className="mb-3">
                      For questions regarding these Terms and Conditions or the ISKO-CHAIN platform, 
                      please contact:
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p><strong>Polytechnic University of the Philippines</strong></p>
                      <p>ISKO-CHAIN Support Team</p>
                      <p>Email: iskochain@pup.edu.ph</p>
                      <p>Website: www.pup.edu.ph</p>
                    </div>
                  </div>
                </section>

              </div>

              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                  <p>
                    Last updated: {currentDate}
                  </p>
                  <p className="mt-2 md:mt-0">
                    Version 1.0 | ISKO-CHAIN Terms & Conditions
                  </p>
                </div>
              </div>

            </div>
          </div>

       {/* Back to Top Button */}
          <div className="text-center mt-8">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center px-6 py-3 text-white font-medium rounded-lg transition-colors duration-200"
              style={{ backgroundColor: '#5b0c0c' }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#4a0a0a'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#5b0c0c'}
            >
              ↑ Back to Top
            </button>
          </div>

        </div>
      </div>
    </>
  );
}