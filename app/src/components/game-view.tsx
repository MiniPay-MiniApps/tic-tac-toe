import { useGame, useJoinGame } from '~/hooks'

import { toast } from 'sonner'
import { useConnection } from 'wagmi'
import type { Player, Winner } from '~/lib/contracts/tic-tac-toe'
import { isZeroAddress } from '~/lib/ethereum'

import { GameBoard } from '~/components/game'

type GameViewProps = {
  gameId: bigint
  onBack: () => void
}

export function GameView({ gameId, onBack }: GameViewProps) {
  const { data: gameData, isLoading, error } = useGame(gameId)
  const { address } = useConnection()
  const {
    joinGame,
    isPending: isJoinPending,
    isConfirming: isJoinConfirming,
  } = useJoinGame()

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent' />
        <span className='ml-3 text-gray-600'>Loading game...</span>
      </div>
    )
  }

  if (error || !gameData) {
    return (
      <div className='space-y-4'>
        <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
          <p className='text-sm text-red-600'>
            Error loading game. Make sure the game ID is correct.
          </p>
        </div>
        <button
          onClick={onBack}
          className='cursor-pointer rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700'
        >
          Back to Home
        </button>
      </div>
    )
  }

  // Convert the board from the contract format (contract returns uint8 as number)
  const board = [
    [gameData.board[0][0], gameData.board[0][1], gameData.board[0][2]],
    [gameData.board[1][0], gameData.board[1][1], gameData.board[1][2]],
    [gameData.board[2][0], gameData.board[2][1], gameData.board[2][2]],
  ] as Player[][]

  const gameState = {
    playerOne: gameData.playerOne,
    playerTwo: gameData.playerTwo,
    winner: gameData.winner as Winner,
    playerTurn: gameData.playerTurn as Player,
    board,
  }

  // Check if user is already in the game
  const isUserInGame =
    !!address
    && ((!isZeroAddress(gameData.playerOne)
      && address.toLowerCase() === gameData.playerOne.toLowerCase())
      || (!isZeroAddress(gameData.playerTwo)
        && address.toLowerCase() === gameData.playerTwo.toLowerCase()))

  // Check if there's an open spot
  const hasOpenSpot =
    isZeroAddress(gameData.playerOne) || isZeroAddress(gameData.playerTwo)

  // Check if game is finished
  const isGameFinished = gameData.winner !== 0

  // Show join button if: user is connected, not in game, has open spot, and game not finished
  const showJoinButton =
    address && !isUserInGame && hasOpenSpot && !isGameFinished

  const handleJoinGame = () => {
    if (!address) {
      toast.error('Please connect your wallet to join a game')
      return
    }

    joinGame(gameId)
  }

  const isJoining = isJoinPending || isJoinConfirming

  return (
    <div className='space-y-6'>
      <button
        onClick={onBack}
        className='cursor-pointer rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700'
      >
        ← Home
      </button>
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>Game #{gameId.toString()}</h2>
          {showJoinButton && (
            <button
              onClick={handleJoinGame}
              disabled={isJoining}
              className='cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isJoining ? 'Joining...' : 'Join game'}
            </button>
          )}
        </div>
        <GameBoard gameId={gameId} game={gameState} isLoading={isLoading} />
      </div>
    </div>
  )
}
