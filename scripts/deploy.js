/**
 * BZR Token Deployment Record
 * 
 * Token: Bazaars (BZR)
 * Total Supply: 555,555,555.555555555555555555 BZR per chain
 * Deployment Date: August 8, 2025
 * Contract Address: 0x85Cb098bdcD3Ca929d2cD18Fc7A2669fF0362242 (same on all chains)
 */

const DEPLOYMENT_INFO = {
  token: {
    name: "Bazaars",
    symbol: "BZR",
    decimals: 18,
    totalSupplyPerChain: "55555555555555555555555555", // 55,555,555.555555555555555555
    contractAddress: "0x85Cb098bdcD3Ca929d2cD18Fc7A2669fF0362242"
  },
  
  chains: {
    ethereum: {
      chainId: 1,
      name: "Ethereum",
      rpc: "https://eth.llamarpc.com",
      explorer: "https://etherscan.io",
      deployed: true,
      txHash: "0xd6b525a2c2e0589320ec7e62eaaa73df45fb5e72586ac69a7143a483b9d7d3f7"
    },
    bsc: {
      chainId: 56,
      name: "BNB Smart Chain",
      rpc: "https://bsc-dataseed.binance.org",
      explorer: "https://bscscan.com",
      deployed: true,
      txHash: "0x6e95f3207ffcdff3dda858b48351d6f4b23f1126c4c59c2cb388feccdc5e3cf8"
    },
    polygon: {
      chainId: 137,
      name: "Polygon",
      rpc: "https://polygon-rpc.com",
      explorer: "https://polygonscan.com",
      deployed: true,
      txHash: "0x19758ecbdbae02484193f6be2cedf61bc99f58f973486ebd1da8301a18c23224"
    },
    arbitrum: {
      chainId: 42161,
      name: "Arbitrum One",
      rpc: "https://arb1.arbitrum.io/rpc",
      explorer: "https://arbiscan.io",
      deployed: true,
      txHash: "0xb77c5f9d4da6ad28fa9fff3f2f3fc2b877c661abea62b5a95c81a2d215e52537"
    },
    optimism: {
      chainId: 10,
      name: "Optimism",
      rpc: "https://mainnet.optimism.io",
      explorer: "https://optimistic.etherscan.io",
      deployed: true,
      txHash: "0xeab4b79b827d713dfdafefb0ae38a47c955c8ac414b80502fadef6080210078e"
    },
    base: {
      chainId: 8453,
      name: "Base",
      rpc: "https://mainnet.base.org",
      explorer: "https://basescan.org",
      deployed: true,
      txHash: "0xf98d8b5e939b077150da3480acd0937f3928a269dd77beee897e500979bebdb6"
    },
    avalanche: {
      chainId: 43114,
      name: "Avalanche",
      rpc: "https://api.avax.network/ext/bc/C/rpc",
      explorer: "https://snowtrace.io",
      deployed: true,
      txHash: "0xaeca953b1fe8fced9219baca7fb50af551ee0efb0b7df5e18337f31a9d6ddc76"
    },
    zksync: {
      chainId: 324,
      name: "zkSync Era",
      rpc: "https://mainnet.era.zksync.io",
      explorer: "https://explorer.zksync.io",
      deployed: true,
      verified: false, // Verification pending
      txHash: "0x050dbeb3bf27972caa62653d1aa8d6552a63672c084d9d26d0c32ed842bbb19d"
    },
    mantle: {
      chainId: 5000,
      name: "Mantle",
      rpc: "https://rpc.mantle.xyz",
      explorer: "https://explorer.mantle.xyz",
      deployed: true,
      txHash: "0x20e321dfa0027dd7758f3dc0197f2c0a6f6c2442b559bb601c7d1ad48aa43670"
    },
    cronos: {
      chainId: 25,
      name: "Cronos",
      rpc: "https://evm.cronos.org",
      explorer: "https://cronoscan.com",
      deployed: true,
      txHash: "0x4bfa8b09d44311ab33a52db5b019262af061e2dab181572852da489b38b3e49c"
    }
  },
  
  // Liquidity pairs
  liquidity: {
    ethereum: {
      dex: "Uniswap V3",
      pair: "BZR/USDT",
      poolAddress: "0x...",
      addedLiquidity: true
    },
    bsc: {
      dex: "PancakeSwap V3",
      pair: "BZR/USDT",
      poolAddress: "0x...",
      addedLiquidity: true
    }
    // Add other chains as you add liquidity
  }
};

// Helper functions
function getExplorerLink(chain, address) {
  const explorer = DEPLOYMENT_INFO.chains[chain].explorer;
  return `${explorer}/address/${address}`;
}

function getTokenInfo() {
  console.log("=== BZR Token Deployment Info ===");
  console.log(`Name: ${DEPLOYMENT_INFO.token.name}`);
  console.log(`Symbol: ${DEPLOYMENT_INFO.token.symbol}`);
  console.log(`Contract: ${DEPLOYMENT_INFO.token.contractAddress}`);
  console.log(`Supply per chain: ${DEPLOYMENT_INFO.token.totalSupplyPerChain}`);
  console.log("\n=== Deployed Chains ===");
  
  Object.entries(DEPLOYMENT_INFO.chains).forEach(([key, chain]) => {
    if (chain.deployed) {
      console.log(`✓ ${chain.name} (${chain.chainId})`);
      console.log(`  Explorer: ${getExplorerLink(key, DEPLOYMENT_INFO.token.contractAddress)}`);
    }
  });
}

// Generate token list
function generateTokenList() {
  const tokens = Object.entries(DEPLOYMENT_INFO.chains)
    .filter(([_, chain]) => chain.deployed)
    .map(([_, chain]) => ({
      chainId: chain.chainId,
      address: DEPLOYMENT_INFO.token.contractAddress,
      name: DEPLOYMENT_INFO.token.name,
      symbol: DEPLOYMENT_INFO.token.symbol,
      decimals: DEPLOYMENT_INFO.token.decimals,
      logoURI: "https://raw.githubusercontent.com/BazaarsBZR/bazaars-token/main/logo.png"
    }));
  
  return {
    name: "Bazaars Token List",
    timestamp: new Date().toISOString(),
    version: {
      major: 1,
      minor: 0,
      patch: 0
    },
    logoURI: "https://raw.githubusercontent.com/BazaarsBZR/bazaars-token/main/logo.png",
    keywords: ["bazaars", "bzr", "defi", "multichain"],
    tokens
  };
}

// Export for use
module.exports = {
  DEPLOYMENT_INFO,
  getExplorerLink,
  getTokenInfo,
  generateTokenList
};

// Run if called directly
if (require.main === module) {
  getTokenInfo();
  console.log("\n=== Generated Token List ===");
  console.log(JSON.stringify(generateTokenList(), null, 2));
}
