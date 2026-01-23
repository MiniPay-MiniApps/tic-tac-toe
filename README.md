# 🎮 TicTacToe

<h4 align="center">
  <a href="https://minipay.to">Website</a> |
  <a href="https://docs.minipay.xyz/">Documentation</a> |
  <a href="https://minipay-invite.onelink.me/kxHS/bepg96hj">Download MiniPay</a>
</h4>

A complete example Mini App for MiniPay developers demonstrating how to build a blockchain-based game with a Solidity smart contract and React frontend. This project showcases best practices for building Mini Apps for MiniPay.

⚙️ Built using React, wagmi, viem, Hardhat, and TypeScript.

- ✅ **Smart Contract Game Logic**: Solidity contract for on-chain tic-tac-toe gameplay
- 🪝 **Custom Hooks**: React hooks wrapper around wagmi to simplify smart contract interactions with TypeScript autocompletion
- 🔐 **MiniPay Wallet Integration**: Seamless connection to MiniPay wallets
- 🌐 **Multi-chain Support**: Works on Hardhat local, Celo Sepolia testnet, and Celo mainnet
- 🔄 **Real-time Updates**: Polls contract state for live game updates

## Requirements

Before you begin, you need to install the following tools:

- [Node.js (>= v20)](https://nodejs.org/en/download/)
- pnpm (enable with `corepack enable`)
- [Git](https://git-scm.com/downloads)
- [MiniPay wallet](https://minipay-invite.onelink.me/kxHS/bepg96hj) (for testing)

## Quickstart

To get started with TicTacToe, follow the steps below:

1. Install dependencies:

```bash
pnpm install
```

This command will install all the necessary packages and dependencies for both the contract and frontend.

2. Compile the smart contracts:

```bash
cd contract
pnpm compile
```

This command compiles the Solidity contracts. You can find the contract code in `contract/contracts/TicTacToe.sol`.

3. Start your development server:

```bash
pnpm dev
```

Visit your app on: `http://localhost:5173` (or the port shown in your terminal). You can create a new game, join an existing game, and play tic-tac-toe using your MiniPay wallet.

**What's next**:

- Deploy your smart contract to a testnet: `cd contract && pnpm deploy:celoSepolia`
- Update contract addresses in `app/src/lib/contracts/tic-tac-toe.ts`
- Customize the frontend components in `app/src/components/`
- Write and run tests: `pnpm test`
- Learn more about MiniPay development at [docs.minipay.xyz](https://docs.minipay.xyz/)
