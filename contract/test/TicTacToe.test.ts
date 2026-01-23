import { network } from 'hardhat'
import assert from 'node:assert/strict'
import { before, describe, it } from 'node:test'
import type { Address } from 'viem'

describe('TicTacToe', async function () {
  const { viem } = await network.connect()
  const publicClient = await viem.getPublicClient()
  let ticTacToe: Awaited<ReturnType<typeof viem.deployContract<'TicTacToe'>>>
  let playerOne: Address
  let playerTwo: Address

  before(async function () {
    ticTacToe = await viem.deployContract('TicTacToe')
    const accounts = await viem.getWalletClients()
    playerOne = accounts[0].account.address
    playerTwo = accounts[1].account.address
  })

  describe('newGame', function () {
    it('Should create a new game', async function () {
      const deploymentBlockNumber = await publicClient.getBlockNumber()
      const hash = await ticTacToe.write.newGame()
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      })

      assert.equal(receipt.status, 'success')

      const events = await publicClient.getContractEvents({
        address: ticTacToe.address,
        abi: ticTacToe.abi,
        eventName: 'GameCreated',
        fromBlock: deploymentBlockNumber,
        strict: true,
      })

      assert.equal(events.length, 1)
    })
  })

  describe('joinGame', function () {
    it('Should allow first player to join', async function () {
      const hash = await ticTacToe.write.newGame()
      await publicClient.waitForTransactionReceipt({ hash })

      const gameId = 1n
      const joinHash = await ticTacToe.write.joinGame([gameId], {
        account: playerOne,
      })
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: joinHash,
      })

      assert.equal(receipt.status, 'success')
    })

    it('Should allow second player to join', async function () {
      const hash = await ticTacToe.write.newGame()
      await publicClient.waitForTransactionReceipt({ hash })

      const gameId = 1n
      await ticTacToe.write.joinGame([gameId], { account: playerOne })
      const joinHash = await ticTacToe.write.joinGame([gameId], {
        account: playerTwo,
      })
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: joinHash,
      })

      assert.equal(receipt.status, 'success')
    })

    it('Should reject joining non-existent game', async function () {
      const gameId = 999n

      const { result } = await publicClient.simulateContract({
        address: ticTacToe.address,
        abi: ticTacToe.abi,
        functionName: 'joinGame',
        args: [gameId],
        account: playerOne,
      })

      const [success, reason] = result

      assert.equal(success, false, 'Should return false for non-existent game')
      assert.equal(
        reason,
        'No such game exists.',
        'Should return correct reason',
      )
    })
  })

  describe('makeMove', function () {
    let gameId: bigint

    before(async function () {
      const hash = await ticTacToe.write.newGame()
      await publicClient.waitForTransactionReceipt({ hash })
      gameId = 1n
      await ticTacToe.write.joinGame([gameId], { account: playerOne })
      await ticTacToe.write.joinGame([gameId], { account: playerTwo })
    })

    it('Should allow player one to make first move', async function () {
      const hash = await ticTacToe.write.makeMove([gameId, 0n, 0n], {
        account: playerOne,
      })
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      })

      assert.equal(receipt.status, 'success')
    })

    it("Should reject move when not player's turn", async function () {
      // After playerOne's move, it's now playerTwo's turn
      // So we should try to make a move with playerOne (wrong player) to test rejection
      const result = await publicClient.simulateContract({
        address: ticTacToe.address,
        abi: ticTacToe.abi,
        functionName: 'makeMove',
        args: [gameId, 1n, 1n],
        account: playerOne,
      })

      const [success, reason] = result.result

      assert.equal(success, false, "Should return false when not player's turn")
      assert.equal(
        reason,
        'It is not your turn.',
        'Should return correct reason',
      )
    })

    it('Should reject move on occupied cell', async function () {
      const result = await publicClient.simulateContract({
        address: ticTacToe.address,
        abi: ticTacToe.abi,
        functionName: 'makeMove',
        args: [gameId, 0n, 0n],
        account: playerOne,
      })

      const [success, reason] = result.result

      assert.equal(success, false, 'Should return false for occupied cell')
      assert.equal(
        reason,
        'There is already a mark at the given coordinates.',
        'Should return correct reason',
      )
    })
  })
})
