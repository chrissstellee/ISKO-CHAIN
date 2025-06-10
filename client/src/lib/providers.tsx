'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getDefaultConfig, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { WagmiConfig, http } from 'wagmi';
import { baseSepolia} from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'ISKO-CHAIN',
  projectId: '3bd3d97c06a09b7baf78f26d69213334', // Replace with your actual WC project ID
  chains: [ baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

// 🆕 Create a QueryClient instance
const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <RainbowKitProvider
                  theme={lightTheme({
            accentColor: '#5b0c0c', // your brand green
            accentColorForeground: '#ffffff',
            borderRadius: 'medium',
            fontStack: 'rounded',
            overlayBlur: 'small',
          })}
        >{children}</RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
