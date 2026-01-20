import type { Address } from 'viem'
import { celo, celoSepolia } from 'wagmi/chains'

import { type SupportedChainId, hardhat } from '../chains'

// Contract addresses per network
// If deploying a new contract, update these with the deployed contract addresses
export const TIC_TAC_TOE_ADDRESSES: Record<SupportedChainId, Address> = {
  [hardhat.id]: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address, // Hardhat local
  [celoSepolia.id]: '0x0000000000000000000000000000000000000000' as Address, // Celo Sepolia testnet
  [celo.id]: '0x8ac272Ff6726BA80044852f6535D5E69288309c5' as Address, // Celo mainnet
}

// TicTacToe Contract ABI
export const TIC_TAC_TOE_ABI = [
  {
    inputs: [],
    name: 'newGame',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_gameId', type: 'uint256' }],
    name: 'joinGame',
    outputs: [
      { internalType: 'bool', name: 'success', type: 'bool' },
      { internalType: 'string', name: 'reason', type: 'string' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_gameId', type: 'uint256' },
      { internalType: 'uint256', name: '_xCoordinate', type: 'uint256' },
      { internalType: 'uint256', name: '_yCoordinate', type: 'uint256' },
    ],
    name: 'makeMove',
    outputs: [
      { internalType: 'bool', name: 'success', type: 'bool' },
      { internalType: 'string', name: 'reason', type: 'string' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_gameId', type: 'uint256' }],
    name: 'getGame',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'playerOne',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'playerTwo',
            type: 'address',
          },
          {
            internalType: 'enum ITicTacToe.Winners',
            name: 'winner',
            type: 'uint8',
          },
          {
            internalType: 'enum ITicTacToe.Players',
            name: 'playerTurn',
            type: 'uint8',
          },
          {
            internalType: 'enum ITicTacToe.Players[3][3]',
            name: 'board',
            type: 'uint8[3][3]',
          },
        ],
        internalType: 'struct ITicTacToe.Game',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'gameId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
    ],
    name: 'GameCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'gameId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        internalType: 'uint8',
        name: 'playerNumber',
        type: 'uint8',
      },
    ],
    name: 'PlayerJoinedGame',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'gameId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'xCoordinate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'yCoordinate',
        type: 'uint256',
      },
    ],
    name: 'PlayerMadeMove',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'gameId',
        type: 'uint256',
      },
      {
        internalType: 'enum ITicTacToe.Winners',
        name: 'winner',
        type: 'uint8',
      },
    ],
    name: 'GameOver',
    type: 'event',
  },
] as const

export function getTicTacToeAddress(chainId: SupportedChainId): Address {
  return TIC_TAC_TOE_ADDRESSES[chainId]
}

// Values matching the contract (uint8)
export const players = {
  None: 0,
  PlayerOne: 1,
  PlayerTwo: 2,
} as const

export type Player = (typeof players)[keyof typeof players]

export const winners = {
  None: 0,
  PlayerOne: 1,
  PlayerTwo: 2,
  Draw: 3,
} as const

export type Winner = (typeof winners)[keyof typeof winners]
