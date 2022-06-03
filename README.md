# Auction

# Install package
npm i

# Test
npx hardhat coverage<br />

# Deploy

## Rinkeby
npx hardhat run --network rinkeby scripts/deployBridge.ts<br />

## BSC
npx hardhat run --network testnet scripts/deployBridge.ts<br />

# Verify

## Rinkeby
npx hardhat verify --network rinkeby --constructor-args argumentsEtc.js 0x70F9d5a9E4325eAbEA113a0a4487591Ca17463be<br />
https://rinkeby.etherscan.io/address/0x70F9d5a9E4325eAbEA113a0a4487591Ca17463be#code<br />

## BSC
npx hardhat verify --network testnet --constructor-args argumentsBsc.js 0xfD652546968FF120F98B530d3aadB3B398F10654<br />
https://testnet.bscscan.com/address/0xfD652546968FF120F98B530d3aadB3B398F10654#code<br />

# Tasks 

## swap
npx hardhat swap --network rinkeby --to 0x624c31357a67344f6d0278a6ef1F839E2136D735 --amount 1.0<br />
<br />
npx hardhat swap --network testnet --to 0x624c31357a67344f6d0278a6ef1F839E2136D735 --amount 1.0<br />

## sign
npx hardhat sign --network rinkeby --to 0x624c31357a67344f6d0278a6ef1F839E2136D735 --amount 1 --nonce 42<br />
<br />
npx hardhat sign --network testnet --to 0x624c31357a67344f6d0278a6ef1F839E2136D735 --amount 1 --nonce 42<br />

## redeem
npx hardhat redeem --network rinkeby --to 0x624c31357a67344f6d0278a6ef1F839E2136D735 --amount 1 --nonce 42 --sign 0x056c3920ae629c14b5f715a977cc2e18e786a2718a50f6c0d6cc838d44f761053d235f43ffdd05f53fa471c7f203a1fe79c65fde46d575514ad34b7a39761e361b<br />
<br />
npx hardhat redeem --network testnet --to 0x624c31357a67344f6d0278a6ef1F839E2136D735 --amount 1 --nonce 42 --sign 0x056c3920ae629c14b5f715a977cc2e18e786a2718a50f6c0d6cc838d44f761053d235f43ffdd05f53fa471c7f203a1fe79c65fde46d575514ad34b7a39761e361b<br />