import { encodeFunctionData, erc20Abi, Hex } from 'viem'
import {
  BundleStatus,
  Execution,
  getOrchestrator,
  MetaIntent,
  Orchestrator,
} from '../../src'
import { getTokenAddress } from '../../src/constants'
import { postMetaIntentWithOwnableValidator } from '../utils/safe7579Signature'
import dotenv from 'dotenv'
dotenv.config()

describe('Orchestrator Service', () => {
  let orchestrator: Orchestrator

  const accountAddress = '0xe6a74e08eff5df62efb601ec04eaf764471da797'

  const execution: Execution = {
    to: getTokenAddress('USDC', 8453),
    value: 0n,
    data: encodeFunctionData({
      functionName: 'transfer',
      abi: erc20Abi,
      args: [accountAddress, 10n],
    }),
  }

  const metaIntent: MetaIntent = {
    targetChainId: 8453, // Base
    tokenTransfers: [
      {
        tokenAddress: getTokenAddress('USDC', 8453),
        amount: 10n,
      },
    ],
    targetAccount: accountAddress,
    targetExecutions: [execution],
  }

  beforeAll(async () => {
    orchestrator = getOrchestrator(
      process.env.ORCHESTRATOR_API_KEY!,
      process.env.ORCHESTRATOR_URL,
    )
  })

  afterAll(async () => {
    // cleanup
  })

  it('should get the portfolio of a user', async () => {
    const portfolio = await orchestrator.getPortfolio(accountAddress)

    expect(portfolio).toBeDefined()
  }, 100_000)

  it('should get the order path for a user', async () => {
    const orderPath = await orchestrator.getOrderPath(
      metaIntent,
      accountAddress,
    )

    expect(orderPath).toBeDefined()
    expect(orderPath.length).toBe(1)

    const { orderBundle, injectedExecutions } = orderPath[0]

    expect(orderBundle).toBeDefined()
    expect(injectedExecutions).toBeDefined()

    console.log(orderBundle)
    console.log(injectedExecutions)
  }, 100_000)

  it('should post a meta intent with ownable validator and return a bundle ID', async () => {
    const bundleResult = await postMetaIntentWithOwnableValidator(
      metaIntent,
      accountAddress,
      process.env.BUNDLE_GENERATOR_PRIVATE_KEY! as Hex,
      orchestrator,
    )

    expect(bundleResult).toBeDefined()
    expect(bundleResult.length).toBe(1)
    expect(bundleResult[0].bundleId).toBeDefined()
    expect(bundleResult[0].status).toBe(BundleStatus.RECEIVED)

    // Wait for 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5_000))
    // Get the bundle status
    const bundleStatus = await orchestrator.getBundleStatus(
      bundleResult[0].bundleId,
    )

    expect(bundleStatus).toBeDefined()
    expect(bundleStatus.status).toBe(BundleStatus.FILLED)
    expect(bundleStatus.fillTimestamp).toBeDefined()
    expect(bundleStatus.fillTransactionHash).toBeDefined()
    expect(bundleStatus.claims.length).toBe(1)

    console.log(bundleStatus)
  }, 100_000)
})
