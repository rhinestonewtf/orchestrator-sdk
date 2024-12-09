import * as dotenv from 'dotenv'

import { Address, encodeFunctionData, erc20Abi, Hex } from 'viem'
import { Execution, getOrchestrator, MetaIntent, Orchestrator } from '../../src'
import { baseUSDC } from '../constants'
import { getEmptyUserOp } from '../../src/utils/userOp'

dotenv.config()

// Utility function to generate a random Ethereum address
const generateRandomAddress = (): Address => {
  const randomHex = () => Math.floor(Math.random() * 16).toString(16)
  return ('0x' + Array.from({ length: 40 }, randomHex).join('')) as Address
}

describe('Orchestrator Service', () => {
  let orchestrator: Orchestrator

  const userId = '157757fa-6952-4576-8858-49d9145987ee'
  const accountAddress = '0xFfF799094Ede20f26d06A6Ff9bFDca13AD260018'

  const execution: Execution = {
    target: baseUSDC,
    value: 0n,
    callData: encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: ['0xD1dcdD8e6Fe04c338aC3f76f7D7105bEcab74F77', 1n],
    }),
  }

  const metaIntent: MetaIntent = {
    targetChainId: 8453, // Base
    tokenTransfers: [
      {
        tokenAddress: baseUSDC,
        amount: 2n,
      },
    ],
    targetAccount: accountAddress,
    targetExecutions: [execution],
    userOp: getEmptyUserOp(),
  }

  beforeAll(async () => {
    orchestrator = getOrchestrator(process.env.ORCHESTRATOR_API_KEY!)
  })

  afterAll(async () => {
    // cleanup
  })

  it('should create a new user account', async () => {
    const userId = await orchestrator.createUserAccount(
      generateRandomAddress(),
      [8453],
    )

    expect(userId).toBeDefined()

    console.log(userId)
  })

  it('should get the user ID for an account address with chainId', async () => {
    const userIdResponse = await orchestrator.getUserId(accountAddress, 8453)

    expect(userIdResponse).toBeDefined()
    expect(userIdResponse.length).toBe(1)
    expect(userIdResponse[0].chainId).toBe(8453)
  })

  it('should get the user ID for an account address without chainId', async () => {
    const userIdResponse = await orchestrator.getUserId(accountAddress)

    expect(userIdResponse).toBeDefined()
    expect(userIdResponse.length).toBeGreaterThan(1)
  })

  it('should get the portfolio of a user', async () => {
    const portfolio = await orchestrator.getPortfolio(userId)

    expect(portfolio).toBeDefined()
  }, 100000)

  it('should get the order path for a user', async () => {
    const { orderBundle, injectedExecutions } = await orchestrator.getOrderPath(
      metaIntent,
      userId,
    )

    expect(orderBundle).toBeDefined()
    expect(injectedExecutions).toBeDefined()

    console.log(orderBundle)
    console.log(injectedExecutions)
  })

  it('should post a meta intent with ownable validator and return a bundle ID', async () => {
    const bundleId = await orchestrator.postMetaIntentWithOwnableValidator(
      metaIntent,
      userId,
      process.env.BUNDLE_GENERATOR_PRIVATE_KEY! as Hex,
    )

    expect(bundleId).toBeDefined()
    console.log(bundleId)

    // Get the bundle status
    const bundleStatus = await orchestrator.getBundleStatus(userId, bundleId)

    expect(bundleStatus).toBeDefined()
    console.log(bundleStatus)
  }, 100000)
})
