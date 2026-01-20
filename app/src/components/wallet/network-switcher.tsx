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
