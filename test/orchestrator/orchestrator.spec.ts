import * as dotenv from 'dotenv'

import { Address, encodeFunctionData, erc20Abi, Hex } from 'viem'
import { Execution, getOrchestrator, MetaIntent } from '../../src'
import { Orchestrator } from '../../src/orchestrator' // Ensure this path is correct
import { getEmptyUserOp } from '../../src/utils/userOp'
import { getTokenAddress } from '../../src/constants'
import { postMetaIntentWithOwnableValidator } from '../utils/safe7579Signature'

dotenv.config()

// Utility function to generate a random Ethereum address
const generateRandomAddress = (): Address => {
  const randomHex = () => Math.floor(Math.random() * 16).toString(16)
  return ('0x' + Array.from({ length: 40 }, randomHex).join('')) as Address
}

describe('Orchestrator Service', () => {
  let orchestrator: Orchestrator

  const userId = '0f3be5e8-6e08-4aa9-9f1c-771371376dff'
  const accountAddress = '0xE13557f24C6f94B68eEF19Ea2800C086E219F23F'

  const execution: Execution = {
    target: '0x7e287a503f0d19b7899c15e80eb18c0ee55ffd12',
    value: 1n,
    callData: '0x',
  }

  const metaIntent: MetaIntent = {
    targetChainId: 42161, // Arb
    tokenTransfers: [
      {
        tokenAddress: getTokenAddress('ETH', 42161),
        amount: 10n,
      },
    ],
    targetAccount: accountAddress,
    targetExecutions: [execution],
    userOp: getEmptyUserOp(),
  }

  beforeAll(async () => {
    orchestrator = getOrchestrator(
      process.env.ORCHESTRATOR_API_KEY!,
    ) as unknown as Orchestrator
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
  }, 10000)

  it('should post a meta intent with ownable validator and return a bundle ID', async () => {
    const bundleId = await postMetaIntentWithOwnableValidator(
      metaIntent,
      userId,
      process.env.BUNDLE_GENERATOR_PRIVATE_KEY! as Hex,
      orchestrator,
    )

    expect(bundleId).toBeDefined()
    console.log(bundleId)

    // Get the bundle status
    const bundleStatus = await orchestrator.getBundleStatus(userId, bundleId)

    expect(bundleStatus).toBeDefined()
    console.log(bundleStatus)
  }, 100000)
})
