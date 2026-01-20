import { http } from 'viem'
import { createConfig } from 'wagmi'
import { injected } from 'wagmi/connectors'

import { supportedChains } from './chains'

export const config = createConfig({
  chains: supportedChains,
  connectors: [
    injected(), // MiniPay injects window.ethereum
  ],
  transports: {
    [supportedChains[0].id]: http(),
    [supportedChains[1].id]: http(),
    [supportedChains[2].id]: http(),
  },
})
