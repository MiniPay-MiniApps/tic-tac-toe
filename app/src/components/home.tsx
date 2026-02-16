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
import { useAllGames } from '~/hooks'

import { GameForm } from '~/components/game'

type HomeProps = {
  onNavigateToGame: (gameId: bigint) => void
}

function getStatusBadgeColor(status: 'waiting' | 'active' | 'finished') {
  switch (status) {
    case 'waiting':
      return 'bg-yellow-100 text-yellow-800'
    case 'active':
      return 'bg-blue-100 text-blue-800'
    case 'finished':
      return 'bg-gray-100 text-gray-800'
  }
}

function getStatusLabel(status: 'waiting' | 'active' | 'finished') {
  switch (status) {
    case 'waiting':
      return 'Waiting for players'
    case 'active':
      return 'Active'
    case 'finished':
      return 'Finished'
  }
}

function getWinnerLabel(winner: number) {
  switch (winner) {
    case 0:
      return 'None'
    case 1:
      return 'Player One'
    case 2:
      return 'Player Two'
    case 3:
      return 'Draw'
    default:
      return 'Unknown'
  }
}

export function Home({ onNavigateToGame }: HomeProps) {
  const { games, isLoading } = useAllGames()

  return (
    <div className='space-y-6'>
      <div className='mx-auto max-w-lg'>
        <GameForm onNavigateToGame={onNavigateToGame} />
      </div>

      <div className='mt-8'>
        <h2 className='mb-4 text-2xl font-semibold text-gray-900'>All Games</h2>
        {isLoading ?
          <div className='flex items-center justify-center p-8'>
            <div className='h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent' />
            <span className='ml-3 text-gray-600'>Loading games...</span>
          </div>
        : games.length === 0 ?
          <div className='rounded-lg border border-gray-200 bg-gray-50 p-6 text-center'>
            <p className='text-gray-600'>
              No games found. Create a new game to get started!
            </p>
          </div>
        : <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {games.map((game) => (
              <button
                key={game.gameId.toString()}
                onClick={() => onNavigateToGame(game.gameId)}
                className='group cursor-pointer rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-blue-300 hover:shadow-md'
              >
                <div className='mb-2 flex items-center justify-between'>
                  <span className='text-lg font-semibold text-gray-900'>
                    Game #{game.gameId.toString()}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeColor(game.status)}`}
                  >
                    {getStatusLabel(game.status)}
                  </span>
                </div>
                <div className='space-y-1 text-sm text-gray-600'>
                  <div>
                    <span className='font-medium'>Player 1:</span>{' '}
                    {(
                      game.playerOne
                      === '0x0000000000000000000000000000000000000000'
                    ) ?
                      <span className='text-gray-400'>Waiting...</span>
                    : `${game.playerOne.slice(0, 6)}...${game.playerOne.slice(-4)}`
                    }
                  </div>
                  <div>
                    <span className='font-medium'>Player 2:</span>{' '}
                    {(
                      game.playerTwo
                      === '0x0000000000000000000000000000000000000000'
                    ) ?
                      <span className='text-gray-400'>Waiting...</span>
                    : `${game.playerTwo.slice(0, 6)}...${game.playerTwo.slice(-4)}`
                    }
                  </div>
                  {game.status === 'finished' && (
                    <div className='pt-1'>
                      <span className='font-medium'>Result:</span>{' '}
                      <span className='text-gray-900'>
                        {getWinnerLabel(game.winner)}
                      </span>
                    </div>
                  )}
                </div>
                <div className='mt-3 text-xs text-blue-600 opacity-0 transition-opacity group-hover:opacity-100'>
                  Click to view →
                </div>
              </button>
            ))}
          </div>
        }
      </div>
    </div>
  )
}
