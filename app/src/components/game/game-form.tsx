import { useEffect, useState } from 'react'

import { useCreateGame, useJoinGame } from '~/hooks/use-game'

type GameFormProps = {
  onNavigateToGame: (gameId: bigint) => void
}

export function GameForm({ onNavigateToGame }: GameFormProps) {
  const [joinGameId, setJoinGameId] = useState<string>('')
  const {
    createGame,
    isPending: isCreatePending,
    isConfirming: isCreateConfirming,
    isSuccess: isCreateSuccess,
    gameId: createdGameId,
    isReady: isCreateReady,
  } = useCreateGame()
  const {
    joinGame,
    isPending: isJoinPending,
    isConfirming: isJoinConfirming,
    isSuccess: isJoinSuccess,
    isReady: isJoinReady,
  } = useJoinGame()

  useEffect(() => {
    if (isCreateSuccess && createdGameId) {
      onNavigateToGame(createdGameId)
    }
  }, [isCreateSuccess, createdGameId, onNavigateToGame])

  useEffect(() => {
    if (isJoinSuccess && joinGameId) {
      onNavigateToGame(BigInt(joinGameId))
    }
  }, [isJoinSuccess, joinGameId, onNavigateToGame])

  const handleCreate = () => {
    createGame()
  }

  const handleJoin = () => {
    const id = BigInt(joinGameId)
    if (id > 0n) {
      joinGame(id)
    }
  }

  if (!isCreateReady || !isJoinReady) {
    return null
  }

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
      <div className='space-y-4'>
        <input
          id='game-id'
          type='number'
          value={joinGameId}
          onChange={(e) => {
            setJoinGameId(e.target.value)
          }}
          placeholder='Enter ID'
          className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none'
        />
        <button
          onClick={handleJoin}
          disabled={isJoinPending || isJoinConfirming || !joinGameId}
          className='w-full rounded-lg bg-green-600 px-4 py-2 text-white enabled:cursor-pointer enabled:hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isJoinPending || isJoinConfirming ? 'Joining...' : 'Join game'}
        </button>
      </div>

      <div className='my-4 flex items-center'>
        <div className='flex-1 border-t border-gray-300'></div>
        <span className='px-3 text-sm text-gray-500'>or</span>
        <div className='flex-1 border-t border-gray-300'></div>
      </div>

      <button
        onClick={handleCreate}
        disabled={isCreatePending || isCreateConfirming}
        className='w-full rounded-lg bg-blue-600 px-4 py-2 text-white enabled:cursor-pointer enabled:hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
      >
        {isCreatePending || isCreateConfirming ?
          'Creating...'
        : 'Create new game'}
      </button>
    </div>
  )
}

// Keep these exports for backward compatibility if needed elsewhere
export function CreateGameForm({ onNavigateToGame }: GameFormProps) {
  return <GameForm onNavigateToGame={onNavigateToGame} />
}

export function JoinGameForm({ onNavigateToGame }: GameFormProps) {
  return <GameForm onNavigateToGame={onNavigateToGame} />
}
