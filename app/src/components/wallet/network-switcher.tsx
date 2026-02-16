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
import { useConnection, useSwitchChain } from 'wagmi'
import { type SupportedChainId, supportedChains } from '~/lib/chains'

export function NetworkSwitcher() {
  const { chainId } = useConnection()
  const { switchChain, isPending } = useSwitchChain()

  return (
    <div className='flex items-center gap-2'>
      <select
        id='network-select'
        value={chainId}
        onChange={(e) => {
          const newChainId = Number.parseInt(
            e.target.value,
            10,
          ) as SupportedChainId
          if (newChainId !== chainId) {
            switchChain({ chainId: newChainId })
          }
        }}
        disabled={isPending}
        className='rounded border border-gray-300 bg-white px-3 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:opacity-50'
      >
        {supportedChains.map((network) => (
          <option key={network.id} value={network.id}>
            {network.name}
          </option>
        ))}
      </select>
      {isPending && <span className='text-sm text-gray-500'>Switching...</span>}
    </div>
  )
}
