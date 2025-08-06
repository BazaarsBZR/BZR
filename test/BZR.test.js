// BZR Token - Remix IDE Test Log
// Manual test suite for core ERC-20 + ORC-55 token behavior
// Executed using JavaScript VM / Injected Web3 via Remix IDE

/*
✅ Deployment
------------
• Deploy BZR.sol using constructor(address initialHolder, uint256 totalInitialSupply)
• Example: initialHolder = accounts[0], totalInitialSupply = 100_000_000 * 10**18
• Confirm balanceOf(initialHolder) == totalInitialSupply
• Confirm totalSupply() == totalInitialSupply

✅ Transfers
-----------
• accounts[0].transfer(accounts[1], 1_000 * 10**18)
• Check:
  - balanceOf(accounts[0]) decreased
  - balanceOf(accounts[1]) increased

✅ Approvals (with race condition protection)
---------------------------------------------
• Attempt to approve(accounts[2], 1000 * 10**18) directly – should pass if no previous approval
• Try re-approving to non-zero value without first zeroing – should revert
• Zero allowance first, then re-approve:
  - approve(accounts[2], 0)
  - approve(accounts[2], 2000 * 10**18)

✅ Transfers From (delegated)
-----------------------------
• accounts[2] calls transferFrom(accounts[0], accounts[3], 500 * 10**18)
• Check:
  - allowance reduced
  - accounts[3] receives tokens

✅ Burn Function
----------------
• accounts[0].burn(10_000 * 10**18)
• Confirm:
  - balanceOf(accounts[0]) reduced
  - totalSupply() reduced
  - totalBurned() increased (if function exists)

✅ Burn From Function
---------------------
• accounts[0] approve(accounts[4], 5_000 * 10**18)
• accounts[4].burnFrom(accounts[0], 5_000 * 10**18)
• Confirm:
  - allowance decreased
  - balanceOf(accounts[0]) decreased
  - totalSupply() decreased

✅ Metadata Checks
------------------
• name() == "Bazaars"
• symbol() == "BZR"
• decimals() == 18
• version() == "5.5"
• isBZR() == true

✅ ERC-5267 Introspection
-------------------------
• getContractMetadata() returns:
  - name = "Bazaars"
  - versionString = "5.5"
  - standard = "ORC-55"
  - abiHash = valid bytes32
  - features = array with "Deflationary", "Multi-Chain-Ready", etc.

✅ Multi-Chain Introspection
----------------------------
• getDeploymentInfo() returns:
  - correct chainId
  - valid deployment hash
  - valid abi hash

✅ ReentrancyGuard Behavior
---------------------------
• Confirm functions with `nonReentrant` modifier revert on reentry attempts (optional test)
*/

