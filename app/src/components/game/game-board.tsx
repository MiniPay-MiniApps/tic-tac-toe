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
import { type GameState, useMakeMove } from '~/hooks'

import { cn } from '@konstantinlindner/cn'
import { useConnection } from 'wagmi'
import { type Player, players, winners } from '~/lib/contracts/tic-tac-toe'
import { isZeroAddress } from '~/lib/ethereum'

type GameBoardProps = {
  gameId: bigint
  game: GameState
  isLoading?: boolean
}

export function GameBoard({ gameId, game, isLoading }: GameBoardProps) {
  const { address } = useConnection()
  const { makeMove, isPending } = useMakeMove()

  const isGameReady =
    !isZeroAddress(game.playerOne) && !isZeroAddress(game.playerTwo)
  const isPlayerOne = address?.toLowerCase() === game.playerOne.toLowerCase()
  const isPlayerTwo = address?.toLowerCase() === game.playerTwo.toLowerCase()
  const isCurrentPlayer =
    isGameReady
    && ((game.playerTurn === players.PlayerOne && isPlayerOne)
      || (game.playerTurn === players.PlayerTwo && isPlayerTwo))

  const handleCellClick = (x: number, y: number) => {
    if (
      !isCurrentPlayer
      || game.winner !== winners.None
      || isLoading
      || isPending
    ) {
      return
    }

    if (game.board[x]?.[y] !== players.None) {
      return
    }

    makeMove(gameId, x, y)
  }

  const getCellContent = (player: Player | undefined) => {
    if (!player) {
      return ''
    }

    if (player === players.PlayerOne) return 'X'
    return 'O'
  }

  const getWinnerMessage = () => {
    if (game.winner === winners.PlayerOne) {
      return isPlayerOne ? 'You won!' : 'Player One won!'
    }
    if (game.winner === winners.PlayerTwo) {
      return isPlayerTwo ? 'You won!' : 'Player Two won!'
    }
    if (game.winner === winners.Draw) {
      return "It's a draw!"
    }
    return null
  }

  const winnerMessage = getWinnerMessage()

  return (
    <div className='space-y-4'>
      <div className='text-center'>
        {!isGameReady ?
          <p className='text-sm text-amber-600'>
            Waiting for two players to join before the game can start.
          </p>
        : winnerMessage ?
          <p className='text-lg font-semibold text-green-600'>
            {winnerMessage}
          </p>
        : <p className='text-sm text-gray-600'>
            {isCurrentPlayer ? 'Your turn!' : 'Waiting for opponent...'}
          </p>
        }
      </div>

      <div className='mx-auto grid w-fit grid-cols-3 gap-2'>
        {[0, 1, 2].map((x) =>
          [0, 1, 2].map((y) => {
            const cellPlayer = game.board[x]?.[y]
            const isEmpty = cellPlayer === players.None
            const isClickable =
              isGameReady
              && isCurrentPlayer
              && isEmpty
              && game.winner === winners.None
              && !isPending

            return (
              <button
                key={`${x}-${y}`}
                onClick={() => {
                  handleCellClick(x, y)
                }}
                disabled={!isClickable || isLoading}
                className={cn(
                  'h-20 w-20 rounded-lg border-2 border-gray-300 bg-white text-2xl font-bold transition-colors',
                  isClickable ?
                    'cursor-pointer hover:border-blue-400 hover:bg-gray-50'
                  : 'cursor-not-allowed opacity-60',
                  cellPlayer === players.PlayerOne && 'text-blue-600',
                  cellPlayer === players.PlayerTwo && 'text-red-600',
                )}
              >
                {getCellContent(cellPlayer)}
              </button>
            )
          }),
        )}
      </div>

      <div className='text-center text-sm text-gray-500'>
        <p>
          Player One (X):{' '}
          {isZeroAddress(game.playerOne) ?
            'Waiting...'
          : `${game.playerOne.slice(0, 6)}...${game.playerOne.slice(-4)}`}
        </p>
        <p>
          Player Two (O):{' '}
          {isZeroAddress(game.playerTwo) ?
            'Waiting...'
          : `${game.playerTwo.slice(0, 6)}...${game.playerTwo.slice(-4)}`}
        </p>
      </div>
    </div>
  )
}
