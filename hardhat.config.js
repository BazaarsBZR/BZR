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
const LINEASCAN_API_KEY = process.env.LINEASCAN_API_KEY || "";

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
    ethereum: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      chainId: 1,
      accounts: [PRIVATE_KEY]
    },
    
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: [PRIVATE_KEY]
    },
    
    polygon: {
      url: "https://polygon-rpc.com/",
      chainId: 137,
      accounts: [PRIVATE_KEY],
      gasPrice: 50000000000
    },
    
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      chainId: 42161,
      accounts: [PRIVATE_KEY]
    },
    
    optimism: {
      url: "https://mainnet.optimism.io",
      chainId: 10,
      accounts: [PRIVATE_KEY]
    },
    
    base: {
      url: "https://mainnet.base.org",
      chainId: 8453,
      accounts: [PRIVATE_KEY],
      gasPrice: 1000000000
    },
    
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      accounts: [PRIVATE_KEY]
    },
    
    zksync: {
      url: "https://mainnet.era.zksync.io",
      chainId: 324,
      accounts: [PRIVATE_KEY],
      zksync: true,
      ethNetwork: "mainnet",
      verifyURL: "https://zksync2-mainnet-explorer.zksync.io/contract_verification"
    },

    // Linea
    linea: {
      url: "https://rpc.linea.build",
      chainId: 59144,
      accounts: [PRIVATE_KEY]
    },
    
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
      mainnet: ETHERSCAN_API_KEY,
      bsc: BSCSCAN_API_KEY,
      polygon: POLYGONSCAN_API_KEY,
      arbitrumOne: ARBISCAN_API_KEY,
      optimisticEthereum: OPTIMISM_API_KEY,
      base: BASESCAN_API_KEY,
      avalanche: SNOWTRACE_API_KEY,

      // Linea
      linea: LINEASCAN_API_KEY
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
        network: "linea",
        chainId: 59144,
        urls: {
          apiURL: "https://api.lineascan.build/api",
          browserURL: "https://lineascan.build"
        }
      }
    ]
  },
  
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
