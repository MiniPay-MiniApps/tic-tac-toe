import { defineChain } from 'viem'
import { celo, celoSepolia } from 'wagmi/chains'

export const hardhat = defineChain({
  id: 31337,
  name: 'Hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
  },
})

// Define all supported chains
export const supportedChains = [celo, celoSepolia, hardhat] as const

// Extract chain IDs as a union type
export type SupportedChainId = (typeof supportedChains)[number]['id']

/**
 * Checks whether the given chain ID is supported.
 *
 * @param chainId - The chain ID to validate (may be `undefined`).
 * @returns A type predicate; `true` if `chainId` is a {@link SupportedChainId}, otherwise `false`.
 */
export function isSupportedChainId(
  chainId: number | undefined,
): chainId is SupportedChainId {
  return supportedChains.some((chain) => chain.id === chainId)
}
