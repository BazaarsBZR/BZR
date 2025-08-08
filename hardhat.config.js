require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY || "";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "";
const ARBISCAN_API_KEY = process.env.ARBISCAN_API_KEY || "";
const OPTIMISM_API_KEY = process.env.OPTIMISM_API_KEY || "";
const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY || "";
const SNOWTRACE_API_KEY = process.env.SNOWTRACE_API_KEY || "";
const MANTLESCAN_API_KEY = process.env.MANTLESCAN_API_KEY || "";
const CRONOSCAN_API_KEY = process.env.CRONOSCAN_API_KEY || "";

module.exports = {
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  
  networks: {
    // Ethereum Mainnet
    ethereum: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      chainId: 1,
      accounts: [PRIVATE_KEY]
    },
    
    // BNB Smart Chain
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: [PRIVATE_KEY]
    },
    
    // Polygon
    polygon: {
      url: "https://polygon-rpc.com/",
      chainId: 137,
      accounts: [PRIVATE_KEY],
      gasPrice: 50000000000 // 50 gwei
    },
    
    // Arbitrum One
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      chainId: 42161,
      accounts: [PRIVATE_KEY]
    },
    
    // Optimism
    optimism: {
      url: "https://mainnet.optimism.io",
      chainId: 10,
      accounts: [PRIVATE_KEY]
    },
    
    // Base
    base: {
      url: "https://mainnet.base.org",
      chainId: 8453,
      accounts: [PRIVATE_KEY],
      gasPrice: 1000000000 // 1 gwei
    },
    
    // Avalanche
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      accounts: [PRIVATE_KEY]
    },
    
    // zkSync Era
    zksync: {
      url: "https://mainnet.era.zksync.io",
      chainId: 324,
      accounts: [PRIVATE_KEY],
      zksync: true,
      ethNetwork: "mainnet",
      verifyURL: "https://zksync2-mainnet-explorer.zksync.io/contract_verification"
    },
    
    // Mantle
    mantle: {
      url: "https://rpc.mantle.xyz",
      chainId: 5000,
      accounts: [PRIVATE_KEY]
    },
    
    // Cronos
    cronos: {
      url: "https://evm.cronos.org",
      chainId: 25,
      accounts: [PRIVATE_KEY]
    },
    
    // Local development
    hardhat: {
      chainId: 31337
    },
    localhost: {
      chainId: 31337,
      url: "http://127.0.0.1:8545"
    }
  },
  
  etherscan: {
    apiKey: {
      // Ethereum
      mainnet: ETHERSCAN_API_KEY,
      
      // BNB Smart Chain
      bsc: BSCSCAN_API_KEY,
      
      // Polygon
      polygon: POLYGONSCAN_API_KEY,
      
      // Arbitrum
      arbitrumOne: ARBISCAN_API_KEY,
      
      // Optimism
      optimisticEthereum: OPTIMISM_API_KEY,
      
      // Base
      base: BASESCAN_API_KEY,
      
      // Avalanche
      avalanche: SNOWTRACE_API_KEY,
      
      // zkSync - handled separately
      
      // Mantle
      mantle: MANTLESCAN_API_KEY,
      
      // Cronos
      cronos: CRONOSCAN_API_KEY
    },
    
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      },
      {
        network: "mantle",
        chainId: 5000,
        urls: {
          apiURL: "https://api.mantlescan.xyz/api",
          browserURL: "https://mantlescan.xyz"
        }
      },
      {
        network: "cronos",
        chainId: 25,
        urls: {
          apiURL: "https://api.cronoscan.com/api",
          browserURL: "https://cronoscan.com"
        }
      }
    ]
  },
  
  // For zkSync (if using hardhat-zksync plugins)
  zksolc: {
    version: "1.3.13",
    compilerSource: "binary",
    settings: {}
  },
  
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  
  mocha: {
    timeout: 200000
  }
};
