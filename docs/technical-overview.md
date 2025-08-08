# BZR Token Technical Overview

## Contract Architecture

### Core Implementation
BZR (Bazaars) is an ERC-20 compliant token built on OpenZeppelin v4.9.0 contracts with additional security features and multi-chain deployment capabilities.

**Contract**: `BZR.sol`  
**Solidity Version**: 0.8.26  
**License**: MIT

### Inheritance Structure
ERC20 (OpenZeppelin) ├── ERC20Burnable ├── ReentrancyGuard ├── ERC165 └── BZR (Implementation)


## Key Features

### 1. Deflationary Mechanism
- **Burn Functions**: 
  - `burn(uint256 amount)`: Users can burn their own tokens
  - `burnFrom(address account, uint256 amount)`: Burn from allowance with reentrancy protection
- **Total Burned Tracking**: `totalBurned()` returns cumulative burned amount
- **No Minting**: Supply can only decrease, never increase

### 2. Security Enhancements

#### Race Condition Protection
```solidity
function approve(address spender, uint256 amount) public override returns (bool) {
    if (amount != 0 && allowance(msg.sender, spender) != 0) {
        revert MustZeroAllowanceFirst();
    }
    return super.approve(spender, amount);
}
Prevents approval front-running attacks
Requires zeroing allowance before setting new non-zero amount
Alternative: Use increaseAllowance() / decreaseAllowance()
Reentrancy Protection
ReentrancyGuard on transferFrom() and burnFrom()
Prevents recursive calls during token operations
No Admin Functions
No owner or admin roles
No pause, blacklist, or upgrade mechanisms
Truly immutable and decentralized
3. Multi-Chain Architecture
Deployment Strategy
Independent deployment on 10 initial chains
Same bytecode, same address: 0x85Cb098bdcD3Ca929d2cD18Fc7A2669fF0362242
Initial chains: 55,555,555.555555555555555555 BZR each
New chains: Can be deployed with 0 initial supply
Chain Death Mechanism
When a blockchain fails/dies, tokens on that chain become inaccessible
Effectively burns that chain's supply without any transaction
Creates antifragile tokenomics - stronger through destruction
Supported Chains

Total Initial Supply: 555,555,555.555555555555555555 BZR
4. Future Chain Expansion
Zero-Supply Deployment
The contract constructor supports deployment with 0 initial supply:


solidity
constructor(address initialHolder, uint256 totalInitialSupply) 
    ERC20("Bazaars", "BZR") 
{
    if (initialHolder == address(0)) revert ZeroAddress();
    if (totalInitialSupply == 0) revert ZeroAmount(); // Can be modified
    
    INITIAL_SUPPLY = totalInitialSupply;
    _mint(initialHolder, totalInitialSupply);
}
While the current implementation reverts on zero supply, this can be bypassed by:
Method 1: Deploy with Minimal Supply


solidity
// Deploy with 1 wei (0.000000000000000001 BZR)
constructor: (deployer_address, 1)
Method 2: Deploy and Burn


solidity
// Deploy with small amount then immediately burn
1. Deploy: (deployer_address, 1000000000000000000) // 1 BZR
2. Call: burn(1000000000000000000) // Burn it all
// Result: 0 circulating supply
Method 3: Modified Deployment (Recommended)
For new chains, deploy a modified version that removes the zero check:


solidity
constructor(address initialHolder, uint256 totalInitialSupply) {
    if (initialHolder == address(0)) revert ZeroAddress();
    // Remove: if (totalInitialSupply == 0) revert ZeroAmount();
    
    INITIAL_SUPPLY = totalInitialSupply;
    if (totalInitialSupply > 0) {
        _mint(initialHolder, totalInitialSupply);
    }
}
Bridge Integration for New Chains
When deploying with 0 supply on new chains:
Deploy BZR contract with 0 (or minimal) supply
Users bridge tokens from existing chains
Bridge mints on destination (requires modified contract with mint function for bridge only)
Total cross-chain supply remains constant
Benefits:
No inflation of total supply
Natural distribution based on demand
Market determines which chains get liquidity
Failed new chains don't reduce overall supply
Technical Specifications
Token Parameters
Name: Bazaars
Symbol: BZR
Decimals: 18
Total Supply: 555,555,555.555555555555555555 (mutable, decreases with burns)
Gas Optimization
Custom errors instead of require strings
Immutable variables for deployment constants
Efficient storage packing
Interface Support (ERC-165)


solidity
- IERC20
- IERC20Metadata  
- IERC5267
- ERC20Burnable (0x3b5a0bf8)
Advanced Features
ERC-5267 Metadata


solidity
function getContractMetadata() external view returns (
    string memory tokenName,
    string memory versionString,
    string memory standard,
    string memory description,
    bytes32 abiHash,
    string[] memory features
)
Provides on-chain contract introspection for automated tooling.
View Functions
circulatingSupply(): Alias for totalSupply()
totalBurned(): Track deflationary progress
getTokenStats(): Comprehensive supply metrics
getBurnRate(): Calculate burn percentage with custom precision
getMultiChainInfo(): Cross-chain deployment data
Error Handling
Custom errors for gas efficiency:
ZeroAddress()
ZeroAmount()
MustZeroAllowanceFirst()
AllowanceUnderflow()
ApproveToZeroAddress()
Security Considerations
Auditing Status
Built on audited OpenZeppelin contracts
Custom modifications focused on approval safety
No experimental features
Known Considerations
Approval Race Condition Fix: May break compatibility with some DEX routers expecting standard approve behavior
No Recovery Mechanism: Burned tokens are permanently destroyed
Chain Risk: Tokens on failed chains are permanently lost
Bridge Trust: New chain deployments rely on bridge security
Best Practices
Always use increaseAllowance() / decreaseAllowance() for approval modifications
Verify contract addresses on each chain before interacting
Monitor chain health for risk assessment
Validate bridge contracts before using
Integration Guide
For New Chain Deployments


solidity
// Option 1: Deploy with 1 wei
BZR bzr = new BZR(msg.sender, 1);

// Option 2: Deploy standard and burn
BZR bzr = new BZR(msg.sender, 1000000000000000000);
bzr.burn(1000000000000000000);
For DEXes


solidity
// Recommended approval pattern
token.approve(router, 0);
token.approve(router, amount);

// Or use increase/decrease
token.increaseAllowance(router, amount);
For Bridges
Deploy BZR on new chain with 0 or minimal supply
Bridge burns on source chain (manual burn)
Bridge mints on destination (requires modified contract)
Track cross-chain supply to prevent inflation
For Wallets
Standard ERC-20 integration
Display burn functions to users
Show total burned in statistics
For Block Explorers
Recognize ERC-5267 metadata
Track burn events to address(0)
Display multi-chain deployment info
Economic Model
Deflationary Mechanics
Voluntary Burns: Users can burn tokens anytime
Chain Death Burns: Automatic when blockchains fail
No Inflation: No minting function exists
Expansion Without Inflation: New chains get supply from bridges, not new minting
Supply Dynamics
Starting: 555,555,555.555555555555555555 total
Direction: Only decreases
End State: Potentially 0 (full deflation possible)
New Chains: Get existing supply through bridges
Deployment Examples
Original 10 Chains (with supply)


javascript
// Deploy with initial supply
const initialHolder = "0xDeployerAddress";
const supply = "55555555555555555555555555"; // 55.5M with 18 decimals
const bzr = await BZR.deploy(initialHolder, supply);
New Chain Deployment (no new supply)


javascript
// Deploy with minimal supply
const initialHolder = "0xDeployerAddress";
const supply = "1"; // 1 wei
const bzr = await BZR.deploy(initialHolder, supply);

// Then burn if desired
await bzr.burn(1);
Future Considerations
Potential Integrations
Cross-chain bridges (user implemented)
Liquidity mining programs
Governance proposals (off-chain)
New chain deployments without supply inflation
Expansion Strategy
Monitor emerging L1s and L2s
Deploy BZR with 0 initial supply
Let market demand drive token distribution
Failed new chains don't impact total supply
Upgrade Path
None - contract is immutable by design. This is a feature, not a limitation.
References
OpenZeppelin Contracts v4.9.0
ERC-20 Standard
ERC-5267 Standard
Contract Source Code

Last Updated: August 8, 2025 Version: 1.1.0


The key addition explains how BZR can expand to new chains without inflating the total supply by deploying with 0 (or minimal) initial supply and relying on bridges to move existing tokens.
