/**
 * Configuration template for Web3 contract settings
 * Copy this file to config.ts and fill in your actual values
 */

export const WEB3_CONFIG = {
  // WalletConnect Project ID
  // Get one from: https://cloud.walletconnect.com/
  walletConnectProjectId: 'YOUR_WALLETCONNECT_PROJECT_ID',

  // Ethereum Mainnet Contract
  mainnet: {
    contractAddress: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    chainId: 1,
    tokenStandard: 'ERC-721' as const,
    blockExplorer: 'https://etherscan.io',
  },

  // Sepolia Testnet Contract (for testing)
  sepolia: {
    contractAddress: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    chainId: 11155111,
    tokenStandard: 'ERC-721' as const,
    blockExplorer: 'https://sepolia.etherscan.io',
  },

  // Mint settings
  mint: {
    enabled: false, // Set to true when contract is ready
    price: '0.05', // Price in ETH
    maxPerWallet: 5,
    maxSupply: 323,
  },
};

// Contract ABI (add your contract's ABI here)
export const CONTRACT_ABI = [
  // Example ERC-721 mint function
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  // Add other contract functions as needed
] as const;
