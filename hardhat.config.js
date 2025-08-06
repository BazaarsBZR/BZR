require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Ensure environment variables are set
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID || "";
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || "";

// You can use either Infura or Alchemy
const ETHEREUM_RPC = `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`;
const SEPOLIA_RPC = `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true, // Enable IR-based optimization (reduces contract size)
    },
  },
  
  networks: {
    // Local development
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    
    // Testnets
    sepolia: {
      url: SEPOLIA_RPC,
      chainId: 11155111,
      accounts: [PRIVATE_KEY],
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`,
      chainId: 5,
      accounts: [PRIVATE_KEY],
    },
    
    // Mainnets - Your 10 supported chains
    mainnet: {
      url: ETHEREUM_RPC,
      chainId: 1,
      accounts: [PRIVATE_KEY],
      gasPrice: "auto",
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: [PRIVATE_KEY],
    },
    polygon: {
      url: `https://polygon-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      chainId: 137,
      accounts: [PRIVATE_KEY],
      gasPrice: 50000000000, // 50 gwei
    },
    arbitrum: {
      url: `https://arbitrum-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      chainId: 42161,
      accounts: [PRIVATE_KEY],
    },
    optimism: {
      url: `https://optimism-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      chainId: 10,
      accounts: [PRIVATE_KEY],
    },
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      accounts: [PRIVATE_KEY],
    },
    base: {
      url: "https://mainnet.base.org",
      chainId: 8453,
      accounts: [PRIVATE_KEY],
    },
    linea: {
      url: `https://linea-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      chainId: 59144,
      accounts: [PRIVATE_KEY],
    },
    scroll: {
      url: "https://rpc.scroll.io",
      chainId: 534352,
      accounts: [PRIVATE_KEY],
    },
    mantle: {
      url: "https://rpc.mantle.xyz",
      chainId: 5000,
      accounts: [PRIVATE_KEY],
    },
  },
  
  // Etherscan verification
  etherscan: {
    apiKey: {
      // Mainnets
      mainnet: ETHERSCAN_API_KEY,
      bsc: process.env.BSCSCAN_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      arbitrumOne: process.env.ARBISCAN_API_KEY || "",
      optimisticEthereum: process.env.OPTIMISM_API_KEY || "",
      avalanche: process.env.SNOWTRACE_API_KEY || "",
      base: process.env.BASESCAN_API_KEY || "",
      linea: process.env.LINEASCAN_API_KEY || "",
      scroll: process.env.SCROLLSCAN_API_KEY || "",
      mantle: process.env.MANTLESCAN_API_KEY || "",
      
      // Testnets
      sepolia: ETHERSCAN_API_KEY,
      goerli: ETHERSCAN_API_KEY,
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
      },
      {
        network: "scroll",
        chainId: 534352,
        urls: {
          apiURL: "https://api.scrollscan.com/api",
          browserURL: "https://scrollscan.com"
        }
      },
      {
        network: "mantle",
        chainId: 5000,
        urls: {
          apiURL: "https://explorer.mantle.xyz/api",
          browserURL: "https://explorer.mantle.xyz"
        }
      }
    ]
  },
  
  // Gas reporter configuration
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    excludeContracts: [],
    src: "./contracts",
  },
  
  // Contract sizer
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
  
  // Paths
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  
  // Mocha test configuration
  mocha: {
    timeout: 40000,
  },
};
