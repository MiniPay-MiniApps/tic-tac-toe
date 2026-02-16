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
import { useEffect, useMemo, useState } from 'react'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { decodeEventLog } from 'viem'
import {
  useConnection,
  usePublicClient,
  useReadContract,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { isSupportedChainId } from '~/lib/chains'
import type { Player, Winner } from '~/lib/contracts/tic-tac-toe'
import {
  TIC_TAC_TOE_ABI,
  getTicTacToeAddress,
} from '~/lib/contracts/tic-tac-toe'
import { isZeroAddress } from '~/lib/ethereum'

export type GameState = {
  playerOne: string
  playerTwo: string
  winner: Winner
  playerTurn: Player
  board: Player[][]
}

function useContractAddress() {
  const { chainId } = useConnection()

  if (!chainId) {
    toast.error('No chain ID found')
    return
  }

  if (!isSupportedChainId(chainId)) {
    toast.error(`Unsupported chain ID: ${chainId}`)
    return
  }

  return getTicTacToeAddress(chainId)
}

function useTransactionInvalidation(isSuccess: boolean) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (isSuccess) {
      void queryClient.invalidateQueries()
    }
  }, [isSuccess, queryClient])
}

export function useGame(gameId: bigint | undefined) {
  const contractAddress = useContractAddress()

  return useReadContract({
    address: contractAddress,
    abi: TIC_TAC_TOE_ABI,
    functionName: 'getGame',
    args: gameId !== undefined ? [gameId] : undefined,
    query: {
      enabled:
        gameId !== undefined
        && !!contractAddress
        && !isZeroAddress(contractAddress),
      refetchInterval: 2000, // Poll every 2 seconds
    },
  })
}

function parseGameCreatedEvent(receipt: {
  logs: { data: `0x${string}`; topics: readonly `0x${string}`[] }[]
}): bigint | null {
  for (const log of receipt.logs) {
    try {
      const decoded = decodeEventLog({
        abi: TIC_TAC_TOE_ABI,
        data: log.data,
        topics: log.topics as [`0x${string}`, ...`0x${string}`[]],
      })

      if (
        'eventName' in decoded
        && decoded.eventName === 'GameCreated'
        && 'args' in decoded
        && 'gameId' in decoded.args
        && typeof decoded.args.gameId === 'bigint'
      ) {
        return decoded.args.gameId
      }
    } catch {
      // Continue to next log
    }
  }

  return null
}

export function useCreateGame() {
  const contractAddress = useContractAddress()
  const isReady = !!contractAddress
  const [gameId, setGameId] = useState<bigint | null>(null)
  const [joinedGameId, setJoinedGameId] = useState<bigint | null>(null)

  const { writeContract, data: hash, isPending } = useWriteContract()
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess,
  } = useWaitForTransactionReceipt({
    hash,
  })

  // Join game transaction
  const {
    writeContract: writeJoinContract,
    data: joinHash,
    isPending: isJoinPending,
  } = useWriteContract()
  const { isLoading: isJoinConfirming, isSuccess: isJoinSuccess } =
    useWaitForTransactionReceipt({
      hash: joinHash,
    })

  // Parse gameId from newGame transaction and automatically join
  useEffect(() => {
    if (!receipt || !contractAddress) {
      return
    }

    const parsedGameId = parseGameCreatedEvent(receipt)
    if (parsedGameId !== null && parsedGameId !== joinedGameId) {
      const timeoutId = setTimeout(() => {
        setGameId(parsedGameId)
        setJoinedGameId(parsedGameId)
        // Automatically join the game after creation
        writeJoinContract({
          address: contractAddress,
          abi: TIC_TAC_TOE_ABI,
          functionName: 'joinGame',
          args: [parsedGameId],
        })
      }, 0)

      return () => {
        clearTimeout(timeoutId)
      }
    }

    return undefined
  }, [receipt, joinedGameId, contractAddress, writeJoinContract])

  useTransactionInvalidation(isSuccess || isJoinSuccess)

  const createGame = () => {
    if (!contractAddress) {
      return
    }

    setGameId(null)
    setJoinedGameId(null)
    writeContract({
      address: contractAddress,
      abi: TIC_TAC_TOE_ABI,
      functionName: 'newGame',
    })
  }

  return {
    createGame,
    hash: joinHash ?? hash,
    isPending: isPending || isJoinPending,
    isConfirming: isConfirming || isJoinConfirming,
    isSuccess: isJoinSuccess, // Only consider it successful after joining
    gameId,
    isReady,
  }
}

export function useJoinGame() {
  const contractAddress = useContractAddress()
  const isReady = !!contractAddress

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  useTransactionInvalidation(isSuccess)

  const joinGame = (gameId: bigint) => {
    if (!contractAddress) {
      return
    }

    writeContract({
      address: contractAddress,
      abi: TIC_TAC_TOE_ABI,
      functionName: 'joinGame',
      args: [gameId],
    })
  }

  return {
    joinGame,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    isReady,
  }
}

export function useMakeMove() {
  const contractAddress = useContractAddress()

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  useTransactionInvalidation(isSuccess)

  const makeMove = (gameId: bigint, x: number, y: number) => {
    if (!contractAddress) {
      return
    }

    writeContract({
      address: contractAddress,
      abi: TIC_TAC_TOE_ABI,
      functionName: 'makeMove',
      args: [gameId, BigInt(x), BigInt(y)],
    })
  }

  return {
    makeMove,
    hash,
    isPending,
    isConfirming,
    isSuccess,
  }
}

export type GameListItem = {
  gameId: bigint
  playerOne: `0x${string}`
  playerTwo: `0x${string}`
  winner: Winner
  playerTurn: Player
  status: 'waiting' | 'active' | 'finished'
}

export function useAllGames() {
  const contractAddress = useContractAddress()
  const publicClient = usePublicClient()
  const { chainId } = useConnection()

  // Query GameCreated events to get all game IDs
  const {
    data: gameIds,
    isLoading: isLoadingGameIds,
    error: gameIdsError,
  } = useQuery({
    queryKey: ['allGameIds', contractAddress, chainId],
    queryFn: async () => {
      if (!contractAddress || !publicClient || !chainId) {
        return []
      }

      if (isZeroAddress(contractAddress)) {
        return []
      }

      try {
        // Get current block number to limit query range
        const currentBlock = await publicClient.getBlockNumber()

        // Query events from the last 20,000 blocks to avoid timeout
        // This should cover several days of games depending on chain
        // For Celo mainnet: ~20k blocks ≈ ~3 days (assuming ~12s block time)
        // If you need more historical games, consider implementing pagination/chunking
        const blocksToQuery = 20_000n
        const fromBlock =
          currentBlock > blocksToQuery ? currentBlock - blocksToQuery : 0n

        // Query GameCreated events from recent blocks
        const events = await publicClient.getContractEvents({
          address: contractAddress,
          abi: TIC_TAC_TOE_ABI,
          eventName: 'GameCreated',
          fromBlock,
          toBlock: currentBlock,
        })

        // Extract unique game IDs from events
        const ids = events
          .map((event) => {
            if (
              event.args
              && 'gameId' in event.args
              && typeof event.args.gameId === 'bigint'
            ) {
              return event.args.gameId
            }
            return null
          })
          .filter((id): id is bigint => id !== null)
          .sort((a, b) => {
            // Sort descending (newest first)
            if (a > b) return -1
            if (a < b) return 1
            return 0
          })

        return ids
      } catch (error) {
        console.error('Error fetching game IDs:', error)
        return []
      }
    },
    enabled: !!contractAddress && !!publicClient && !!chainId,
    refetchInterval: 5000, // Refetch every 5 seconds
  })

  // Fetch all game states in parallel
  const contracts = useMemo(
    () =>
      gameIds?.map((gameId) => ({
        address: contractAddress!,
        abi: TIC_TAC_TOE_ABI,
        functionName: 'getGame' as const,
        args: [gameId] as const,
      })) ?? [],
    [gameIds, contractAddress],
  )

  const {
    data: gameResults,
    isLoading: isLoadingGames,
    error: gamesError,
  } = useReadContracts({
    contracts,
    query: {
      enabled: contracts.length > 0 && !!contractAddress,
      refetchInterval: 2000, // Poll every 2 seconds
    },
  })

  const games: GameListItem[] = useMemo(() => {
    if (!gameIds || !gameResults) {
      return []
    }

    const gameList: GameListItem[] = []

    for (let index = 0; index < gameIds.length; index++) {
      const gameId = gameIds[index]
      const gameData = gameResults[index]

      if (!gameData || gameData.status === 'failure') {
        continue
      }

      const gameResult = gameData.result as {
        playerOne: `0x${string}`
        playerTwo: `0x${string}`
        winner: number
        playerTurn: number
        board: readonly [
          readonly [number, number, number],
          readonly [number, number, number],
          readonly [number, number, number],
        ]
      }

      // Determine game status
      let status: 'waiting' | 'active' | 'finished'
      if (gameResult.winner !== 0) {
        // Winner enum: 0 = None, 1 = PlayerOne, 2 = PlayerTwo, 3 = Draw
        status = 'finished'
      } else if (
        gameResult.playerOne !== '0x0000000000000000000000000000000000000000'
        && gameResult.playerTwo !== '0x0000000000000000000000000000000000000000'
      ) {
        status = 'active'
      } else {
        status = 'waiting'
      }

      gameList.push({
        gameId,
        playerOne: gameResult.playerOne,
        playerTwo: gameResult.playerTwo,
        winner: gameResult.winner as Winner,
        playerTurn: gameResult.playerTurn as Player,
        status,
      })
    }

    return gameList
  }, [gameIds, gameResults])

  return {
    games,
    isLoading: isLoadingGameIds || isLoadingGames,
    error: gameIdsError ?? gamesError,
  }
}
