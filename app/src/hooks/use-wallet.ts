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
import { useEffect } from 'react'

import { toast } from 'sonner'
import { createPublicClient, custom, erc20Abi, formatUnits } from 'viem'
import {
  useConnect,
  useConnection,
  useConnectors,
  useReadContracts,
  useWalletClient,
} from 'wagmi'
import { getEthereumProvider } from '~/lib/ethereum'
import {
  type Token,
  type TokenSymbol,
  getTokens,
  tokenSymbols,
} from '~/lib/tokens'

export function useAutoConnect() {
  const connectors = useConnectors()
  const { connect } = useConnect()

  useEffect(() => {
    if (!connectors[0]) {
      return
    }

    connect({ connector: connectors[0] })
  }, [connectors, connect])
}

type TokenBalance = {
  balance: string
  formattedBalance: string
  symbol: TokenSymbol
  decimals: number
  token: Token
}

export function useAllWalletBalances(): {
  balances: TokenBalance[]
  totalUSD: string
  isLoading: boolean
} {
  const { address, chainId } = useConnection()

  const tokens = getTokens(chainId)

  const contracts =
    !tokens ?
      []
    : tokenSymbols.flatMap((symbol) => {
        const token = tokens[symbol]
        return [
          {
            address: token.address,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [address],
          },
          {
            address: token.address,
            abi: erc20Abi,
            functionName: 'decimals',
          },
          {
            address: token.address,
            abi: erc20Abi,
            functionName: 'symbol',
          },
        ]
      })

  const {
    data: balanceResults,
    isLoading,
    error,
  } = useReadContracts({
    allowFailure: false,
    contracts,
    query: {
      enabled: !!address && !!chainId && !!tokens,
    },
  })

  if (error) {
    toast.error(error.message)
  }

  if (!tokens) {
    return {
      balances: [],
      totalUSD: 'N/A',
      isLoading,
    }
  }

  const userLocale = navigator.language || 'en-US'
  const decimalFormatter = new Intl.NumberFormat(userLocale, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  const currencyFormatter = new Intl.NumberFormat(userLocale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  if (!balanceResults) {
    return {
      balances: tokenSymbols.map((symbol) => ({
        balance: 'N/A',
        formattedBalance: 'N/A',
        symbol,
        decimals: tokens[symbol].decimals,
        token: tokens[symbol],
      })),
      totalUSD: 'N/A',
      isLoading,
    }
  }

  const balances: TokenBalance[] = tokenSymbols.map((symbol, index) => {
    const token = tokens[symbol]
    const resultIndex = index * 3
    const [balance, decimals] = balanceResults.slice(
      resultIndex,
      resultIndex + 2,
    )

    const balanceBigInt = typeof balance === 'bigint' ? balance : BigInt(0)
    const decimalsNumber =
      typeof decimals === 'number' ? decimals : (
        Number(decimals ?? token.decimals)
      )
    const stringBalance =
      balanceBigInt && decimalsNumber ?
        formatUnits(balanceBigInt, decimalsNumber)
      : '0'
    const formattedBalance = decimalFormatter.format(Number(stringBalance))

    return {
      balance: stringBalance,
      formattedBalance,
      symbol,
      decimals: decimalsNumber,
      token,
    }
  })

  const totalUSDValue = balances.reduce(
    (sum, tokenBalance) => sum + Number(tokenBalance.balance),
    0,
  )
  const totalUSD = currencyFormatter.format(totalUSDValue)

  return {
    balances,
    totalUSD,
    isLoading: false,
  }
}

/**
 * Get token with highest balance for auto-selection
 */
export function getTokenWithHighestBalance(
  balances: TokenBalance[],
): TokenSymbol | null {
  if (balances.length === 0) {
    return null
  }

  const sortedBalances = [...balances].sort(
    (a, b) => Number(b.balance) - Number(a.balance),
  )

  const highestBalance = sortedBalances[0]

  if (!highestBalance) {
    return null
  }

  return Number(highestBalance.balance) > 0 ? highestBalance.symbol : null
}

/**
 * Hook to get a public client for the current wallet
 * @returns Public client
 * @throws Error if wallet is not connected
 */
export function usePublicClient() {
  const { data: walletClient } = useWalletClient()

  const publicClient = createPublicClient({
    chain: walletClient?.chain,
    transport: custom(getEthereumProvider()),
  })

  return publicClient
}
