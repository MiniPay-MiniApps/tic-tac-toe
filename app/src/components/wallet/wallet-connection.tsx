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
import { useState } from 'react'

import { cn } from '@konstantinlindner/cn'
import { useConnection } from 'wagmi'
import { useAllWalletBalances } from '~/hooks/use-wallet'

export function WalletConnection() {
  const { address, isConnected, isConnecting } = useConnection()
  const { balances, totalUSD, isLoading } = useAllWalletBalances()
  const [isExpanded, setIsExpanded] = useState(false)

  if (isConnecting) {
    return (
      <div className='flex items-center gap-2 rounded-lg bg-gray-100 p-4'>
        <div className='h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent' />
        <span className='text-sm text-gray-600'>Connecting to MiniPay...</span>
      </div>
    )
  }

  if (!isConnected || !address) {
    return (
      <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
        <p className='text-sm text-red-600'>Not connected to wallet</p>
      </div>
    )
  }

  return (
    <div className='rounded-lg border border-gray-200 bg-white shadow-sm'>
      <button
        type='button'
        onClick={() => {
          setIsExpanded(!isExpanded)
        }}
        className='flex w-full items-center justify-between rounded-lg p-4 text-left transition-colors hover:bg-gray-50'
      >
        <div className='flex flex-1 items-center gap-4'>
          <div className='flex-1'>
            <p className='mb-1 text-xs text-gray-500'>Wallet Address</p>
            <p className='font-mono text-sm text-gray-800'>
              {address.slice(0, 6)}...{address.slice(-8)}
            </p>
          </div>
          <div className='flex-1 text-right'>
            <p className='mb-1 text-xs text-gray-500'>Total Balance</p>
            {isLoading ?
              <div className='ml-auto h-7 w-18 animate-pulse rounded bg-gray-200' />
            : <p className='text-lg font-semibold text-gray-900'>{totalUSD}</p>}
          </div>
        </div>
        <svg
          className={cn(
            'mr-4 ml-8 h-5 w-5 text-gray-500 transition-transform',
            isExpanded && 'rotate-180',
          )}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>

      {isExpanded && (
        <div className='border-t border-gray-100 p-4 pt-3'>
          <p className='mb-2 text-xs text-gray-500'>Token Balances</p>
          <div className='space-y-2'>
            {balances.map((balance) => (
              <div
                key={balance.symbol}
                className='flex items-center justify-between rounded-md bg-gray-50 px-3 py-2'
              >
                <span className='text-sm font-medium text-gray-700'>
                  {balance.symbol}
                </span>
                {isLoading ?
                  <div className='h-4 w-16 animate-pulse rounded bg-gray-200' />
                : <span className='text-sm text-gray-600'>
                    {`$${balance.formattedBalance} ${balance.symbol}`}
                  </span>
                }
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
