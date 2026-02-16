/*
 * Copyright 2016-2026, Opera Norway AS
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
