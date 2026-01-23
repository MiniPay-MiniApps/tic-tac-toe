import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

export default buildModule('TicTacToeModule', (m) => {
  const ticTacToe = m.contract('TicTacToe')

  return { ticTacToe }
})
