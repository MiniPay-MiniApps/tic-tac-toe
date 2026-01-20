// Load .env from contract/ or project root (when running from contract directory)
// config({ path: resolve(process.cwd(), '.env') })
// config({ path: resolve(process.cwd(), '../.env') })
import hardhatNetworkHelpers from '@nomicfoundation/hardhat-network-helpers'
import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem'
import hardhatVerify from '@nomicfoundation/hardhat-verify'
import hardhatViem from '@nomicfoundation/hardhat-viem'
import hardhatViemAssertions from '@nomicfoundation/hardhat-viem-assertions'
import 'dotenv/config'
import { configVariable, defineConfig } from 'hardhat/config'

export default defineConfig({
  plugins: [
    hardhatToolboxViemPlugin,
    hardhatViem,
    hardhatViemAssertions,
    hardhatNetworkHelpers,
    hardhatVerify,
  ],
  solidity: {
    profiles: {
      default: {
        version: '0.8.28',
      },
      production: {
        version: '0.8.28',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhat: {
      type: 'edr-simulated',
      chainType: 'l1',
    },
    hardhatMainnet: {
      type: 'edr-simulated',
      chainType: 'l1',
    },
    hardhatOp: {
      type: 'edr-simulated',
      chainType: 'op',
    },
    localhost: {
      type: 'http',
      chainType: 'l1',
      url: 'http://127.0.0.1:8545',
      chainId: 31337,
    },
    celoSepolia: {
      type: 'http',
      chainType: 'l1',
      url: configVariable('CELO_SEPOLIA_RPC_URL'),
      accounts: [configVariable('CELO_SEPOLIA_PRIVATE_KEY')],
      chainId: 11142220,
    },
    celo: {
      type: 'http',
      chainType: 'l1',
      url: configVariable('CELO_RPC_URL'),
      accounts: [configVariable('CELO_PRIVATE_KEY')],
      chainId: 42220,
    },
  },
})
