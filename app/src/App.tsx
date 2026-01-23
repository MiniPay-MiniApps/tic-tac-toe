import { type ReactElement, useState } from 'react'

import { queryClient } from '~/clients'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import { WagmiProvider } from 'wagmi'
import { useAutoConnect } from '~/hooks/use-wallet'

import { GameView } from '~/components/game-view'
import { Home } from '~/components/home'
// import { NetworkSwitcher } from '~/components/wallet/network-switcher'
import { WalletConnection } from '~/components/wallet'

import { config } from './lib/wagmi'

export const App = (): ReactElement => {
  const [currentGameId, setCurrentGameId] = useState<bigint | null>(null)

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContent
          currentGameId={currentGameId}
          onNavigateToGame={setCurrentGameId}
          onBackToHome={() => {
            setCurrentGameId(null)
          }}
        />
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

type AppContentProps = {
  currentGameId: bigint | null
  onNavigateToGame: (gameId: bigint) => void
  onBackToHome: () => void
}

function AppContent({
  currentGameId,
  onNavigateToGame,
  onBackToHome,
}: AppContentProps) {
  useAutoConnect()

  return (
    <div className='min-h-screen'>
      <div className='container mx-auto max-w-4xl px-4 py-8'>
        <header className='mb-8'>
          <div className='mb-4 flex items-center justify-between'>
            <div>
              <h1 className='mb-2 text-3xl font-bold text-gray-900'>
                TicTacToe
              </h1>
              <p className='text-gray-600'>
                Play tic-tac-toe on the blockchain with MiniPay
              </p>
            </div>
          </div>
          {/* Uncomment to enable network switcher in local development */}
          {/* <div className='mb-4'>
            <NetworkSwitcher />
          </div> */}
          <div className='mb-6'>
            <WalletConnection />
          </div>
        </header>

        <main>
          {currentGameId === null ?
            <Home onNavigateToGame={onNavigateToGame} />
          : <GameView gameId={currentGameId} onBack={onBackToHome} />}
        </main>
      </div>
    </div>
  )
}
