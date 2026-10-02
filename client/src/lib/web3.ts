/**
 * DESIGN PHILOSOPHY: Digital Noir - Cinematic Brutalism
 * Web3 wallet connection configuration
 */

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';

// Web3 configuration
export const config = getDefaultConfig({
  appName: 'Digital Noir Collection',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // TODO: Replace with actual project ID
  chains: [mainnet, sepolia],
  ssr: false,
});

// Contract configuration (placeholders)
export const CONTRACT_CONFIG = {
  // Ethereum mainnet
  mainnet: {
    address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    chainId: 1,
    standard: 'ERC-721' as const,
  },
  // Sepolia testnet
  sepolia: {
    address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    chainId: 11155111,
    standard: 'ERC-721' as const,
  },
};

// Helper to get contract config for current chain
export function getContractConfig(chainId: number) {
  switch (chainId) {
    case 1:
      return CONTRACT_CONFIG.mainnet;
    case 11155111:
      return CONTRACT_CONFIG.sepolia;
    default:
      return CONTRACT_CONFIG.mainnet;
  }
}
