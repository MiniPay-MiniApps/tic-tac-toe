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
import { toast } from 'sonner'
import type { Address } from 'viem'

import { isSupportedChainId } from './chains'

export const tokenSymbols = ['USDM', 'USDC', 'USDT'] as const
export type TokenSymbol = (typeof tokenSymbols)[number]

export type Token = {
  symbol: TokenSymbol
  name: string
  address: Address
  decimals: number
}

// Token addresses on Celo mainnet
export const CELO_TOKENS: Record<TokenSymbol, Token> = {
  USDM: {
    symbol: 'USDM',
    name: 'Mento Dollar',
    address: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
    decimals: 18,
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C',
    decimals: 6,
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether',
    address: '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e',
    decimals: 6,
  },
}

// Token addresses on Celo Sepolia testnet
export const SEPOLIA_TOKENS: Record<TokenSymbol, Token> = {
  USDM: {
    symbol: 'USDM',
    name: 'Mento Dollar',
    address: '0xEF4d55D6dE8e8d73232827Cd1e9b2F2dBb45bC80',
    decimals: 18,
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x01C5C0122039549AD1493B8220cABEdD739BC44E',
    decimals: 6,
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether',
    address: '0xd077A400968890Eacc75cdc901F0356c943e4fDb',
    decimals: 6,
  },
}

export function getTokens(
  chainId: number | undefined,
): Record<TokenSymbol, Token> | undefined {
  if (!chainId) {
    return
  }

  if (!isSupportedChainId(chainId)) {
    toast.error(`Unsupported chain ID: ${chainId}`)
    return
  }

  const isMainnet = chainId === 42220
  return isMainnet ? CELO_TOKENS : SEPOLIA_TOKENS
}
