/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface BlockchainTableLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export default function BlockchainTableLoader({ size = 'md', message = 'Loading blockchain data...' }: BlockchainTableLoaderProps) {
  const sizeClasses = {
    sm: { container: 'w-6 h-6', block: 'w-1.5 h-1.5', text: 'text-xs' },
    md: { container: 'w-10 h-10', block: 'w-2.5 h-2.5', text: 'text-sm' },
    lg: { container: 'w-16 h-16', block: 'w-4 h-4', text: 'text-base' }
  };

  const { container, block, text } = sizeClasses[size];

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Blockchain blocks wave animation */}
      <div className={`flex items-center justify-center space-x-1 mb-3`}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center">
            <div
              className={`${block} rounded-sm bg-gradient-to-br from-red-700 to-red-900 shadow-lg animate-wave relative`}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            >
              {/* Block shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-sm" />
            </div>
            
            {/* Chain connecting to next block */}
            {i < 3 && (
              <div className="flex items-center mx-1">
                {/* Chain links */}
                <div 
                  className="w-1 h-1 bg-red-500 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2 + 0.1}s` }}
                />
                <div 
                  className="w-1 h-0.5 bg-red-600 mx-0.5"
                  style={{ 
                    width: size === 'sm' ? '3px' : size === 'md' ? '4px' : '6px'
                  }}
                />
                <div 
                  className="w-1 h-1 bg-red-500 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2 + 0.15}s` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hash symbol with typewriter effect */}
      <div className="flex items-center justify-center mb-2">
        <div className="text-red-600 font-mono font-bold" 
             style={{ fontSize: size === 'sm' ? '10px' : size === 'md' ? '14px' : '18px' }}>
          <span className="animate-pulse">0x</span>
          <span className="animate-pulse" style={{ animationDelay: '0.3s' }}>A</span>
          <span className="animate-pulse" style={{ animationDelay: '0.6s' }}>B</span>
          <span className="animate-pulse" style={{ animationDelay: '0.9s' }}>C</span>
        </div>
      </div>

      {/* Loading message */}
      {message && (
        <div className={`text-gray-600 font-medium ${text} animate-pulse`}>
          {message}
        </div>
      )}

      {/* Animated dots */}
      <div className="flex space-x-1 mt-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1 h-1 bg-red-600 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
          60% { transform: translateY(-3px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes wave {
          0%, 100% { transform: translateY(0px); }
          25% { transform: translateY(-3px); }
          50% { transform: translateY(-6px); }
          75% { transform: translateY(-3px); }
        }
        
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Example usage in different contexts
function TableLoadingExample() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Table with loading state */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Credential Transactions</h2>
          </div>
          
          <div className="p-8">
            <BlockchainTableLoader size="md" message="Fetching blockchain records..." />
          </div>
        </div>

        {/* Different sizes demonstration */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-6">Loading Spinner Sizes</h3>
          
          <div className="flex items-center space-x-12">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Small</p>
              <BlockchainTableLoader size="sm" message="" />
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Medium</p>
              <BlockchainTableLoader size="md" message="" />
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Large</p>
              <BlockchainTableLoader size="lg" message="" />
            </div>
          </div>
        </div>

        {/* Inline table row loading */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Inline Loading Example</h2>
          </div>
          
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0x1a2b3c...</td> */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Confirmed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Certificate</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <BlockchainTableLoader size="sm" message="" />
                    <span className="ml-2 text-sm text-gray-400">Validating...</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Diploma</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}