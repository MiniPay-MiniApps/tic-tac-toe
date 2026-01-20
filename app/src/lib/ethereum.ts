export const getEthereumProvider = () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error(
      'window.ethereum is required. Please ensure you are running in a Web3-enabled environment (e.g., MiniPay).',
    )
  }
  return window.ethereum
}

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const isZeroAddress = (addr: string | undefined): boolean =>
  !addr || addr.toLowerCase() === ZERO_ADDRESS
