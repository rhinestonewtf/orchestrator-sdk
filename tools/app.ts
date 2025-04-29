import {
  getOrchestrator,
  Orchestrator,
  MetaIntent,
  UserTokenBalance,
  applyInjectedExecutions,
  getOrderBundleHash,
  getSignedOrderBundle,
} from '@rhinestone/orchestrator-sdk'
import {
  getOwnableValidatorSignature,
  OWNABLE_VALIDATOR_ADDRESS,
} from '@rhinestone/module-sdk'
import { Address, Hex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { Command, Option } from 'commander'

const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL
const ORCHESTRATOR_API_KEY = process.env.ORCHESTRATOR_API_KEY
const SIGNER_KEY = process.env.SIGNER_KEY

const program = new Command()

// TODO: Create safe account command

program
  .command('portfolio')
  .description('Get the portfolio of a user')
  .argument('<userAddress>', 'The address of the user')
  .addOption(
    new Option(
      '-c, --chainIds <chains...>',
      'The chains to get the portfolio for',
    ),
  )
  .addOption(
    new Option(
      '-t, --tokens <tokens...>',
      'The tokens to get the portfolio for',
    ),
  )
  .addOption(
    new Option(
      '--orchestrator-url',
      'The URL of the orchestrator server',
    ).default(ORCHESTRATOR_URL),
  )
  .addOption(
    new Option(
      '--orchestrator-api-key',
      'The API key for the orchestrator server',
    ).default(ORCHESTRATOR_API_KEY),
  )
  .action(
    async (
      userAddress,
      { chainIds, tokens, orchestratorUrl, orchestratorApiKey, ...args },
    ) => {
      if (chainIds) {
        chainIds = chainIds.map((chain: string) => parseInt(chain))
      }
      if (tokens) {
        tokens = tokens
          .map((chainAndToken: string) => {
            const [chainId, token] = chainAndToken.split(':')
            return { chainId: parseInt(chainId), token }
          })
          .reduce((acc: any, token: any) => {
            if (!acc[token.chainId]) {
              acc[token.chainId] = []
            }
            acc[token.chainId].push(token.token)
            return acc
          }, {})
      }
      const orchestrator: Orchestrator = getOrchestrator(
        orchestratorApiKey,
        orchestratorUrl,
      )

      const portfolio = await orchestrator.getPortfolio(userAddress, {
        chainIds,
        tokens,
      })
      console.table(
        portfolio.reduce((acc: any[], balance: UserTokenBalance) => {
          for (const chainBalance of balance.tokenChainBalance) {
            acc.push({
              tokenName: balance.tokenName,
              chainId: chainBalance.chainId,
              balance: balance.balance,
              chainBalance: chainBalance.balance,
              tokenDecimals: balance.tokenDecimals,
              tokenAddress: chainBalance.tokenAddress,
            })
          }
          return acc
        }, [] as any[]),
      )
    },
  )

program
  .command('bundle:path')
  .alias('path')
  .description('Get an order path for an intent')
  .argument('<userAddress>', 'The address of the user')
  .argument('<targetChain>', 'The chain ID to execute the intent on')
  .argument('<transfers...>', 'The transfers to execute')
  .addOption(
    new Option(
      '-t, --targetAccount <targetAccount>',
      'The target account to execute the transfers on. Defaults to the user address',
    ),
  )
  .addOption(
    new Option(
      '-e, --executions <executions...>',
      'The target executions to run on destination chain',
    ),
  )
  .addOption(
    new Option('-u, --userOp <userOp>', 'The user operation to perform'),
  )
  .addOption(
    new Option(
      '-a, --accessList <accessList...>',
      'Chain ID and token address pairs to pull funds from',
    ),
  )
  .addOption(
    new Option(
      '-v, --access-list-v1 <accountAccessListV1>',
      'Use account access list v1 format',
    ).default(false),
  )
  .addOption(
    new Option(
      '--orchestrator-url',
      'The URL of the orchestrator server',
    ).default(ORCHESTRATOR_URL),
  )
  .addOption(
    new Option(
      '--orchestrator-api-key',
      'The API key for the orchestrator server',
    ).default(ORCHESTRATOR_API_KEY),
  )
  .action(async (userAddress, targetChain, transfers, options) => {
    const intent = parseBundleArgs(userAddress, targetChain, transfers, options)
    const orchestrator: Orchestrator = getOrchestrator(
      options.orchestratorApiKey,
      options.orchestratorUrl,
    )
    const result = await orchestrator.getOrderPath(intent, userAddress)
    for (const { orderBundle, injectedExecutions } of result) {
      console.log(orderBundle)
    }
  })

program
  .command('bundle:post')
  .alias('post')
  .description('Gets and posts an order path for an intent')
  .argument('<userAddress>', 'The address of the user')
  .argument('<targetChain>', 'The chain ID to execute the intent on')
  .argument('<transfers...>', 'The transfers to execute')
  .addOption(
    new Option(
      '-t, --targetAccount <targetAccount>',
      'The target account to execute the transfers on. Defaults to the user address',
    ),
  )
  .addOption(
    new Option(
      '-e, --executions <executions...>',
      'The target executions to run on destination chain',
    ),
  )
  .addOption(
    new Option('-u, --userOp <userOp>', 'The user operation to perform'),
  )
  .addOption(
    new Option(
      '-a, --accessList <accessList...>',
      'Chain ID and token address pairs to pull funds from',
    ),
  )
  .addOption(
    new Option(
      '--orchestrator-url',
      'The URL of the orchestrator server',
    ).default(ORCHESTRATOR_URL),
  )
  .addOption(
    new Option(
      '--orchestrator-api-key',
      'The API key for the orchestrator server',
    ).default(ORCHESTRATOR_API_KEY),
  )
  .addOption(
    new Option(
      '-s, --signer-key <signerKey>',
      'The private key of the signer',
    ).default(SIGNER_KEY),
  )
  .action(async (userAddress, targetChain, transfers, options) => {
    const intent = parseBundleArgs(userAddress, targetChain, transfers, options)
    const orchestrator: Orchestrator = getOrchestrator(
      options.orchestratorApiKey,
      options.orchestratorUrl,
    )
    const orderPath = await orchestrator.getOrderPath(intent, userAddress)

    const signer = privateKeyToAccount(options.signerKey)
    const bundles = await Promise.all(
      orderPath.map(async ({ orderBundle, injectedExecutions }) => {
        const updatedOrderBundle = applyInjectedExecutions({
          orderBundle,
          injectedExecutions,
        })
        const messageHash = getOrderBundleHash(updatedOrderBundle)
        const signature = await signer.signMessage({
          message: {
            raw: messageHash,
          },
        })

        const ownableValidatorSig = getOwnableValidatorSignature({
          signatures: [signature],
        })

        const encodedSignature = (OWNABLE_VALIDATOR_ADDRESS +
          ownableValidatorSig.slice(2)) as Hex

        const signedOrderBundle = getSignedOrderBundle(
          updatedOrderBundle,
          encodedSignature,
        )

        return { signedOrderBundle }
      }),
    )
    const result = await orchestrator.postSignedOrderBundle(bundles)
    console.log(result)
  })

program
  .command('bundle:status')
  .alias('status')
  .description('Get the status of a bundle')
  .argument('<bundleId>', 'The ID of the bundle')
  .addOption(
    new Option(
      '--orchestrator-url',
      'The URL of the orchestrator server',
    ).default(ORCHESTRATOR_URL),
  )
  .addOption(
    new Option(
      '--orchestrator-api-key',
      'The API key for the orchestrator server',
    ).default(ORCHESTRATOR_API_KEY),
  )
  .action(async (bundleId, { orchestratorUrl, orchestratorApiKey }) => {
    const orchestrator: Orchestrator = getOrchestrator(
      orchestratorApiKey,
      orchestratorUrl,
    )
    const status = await orchestrator.getBundleStatus(bundleId)
    console.log(status)
  })

program
  .command('bundle:pending')
  .alias('pending')
  .addOption(
    new Option('-c, --count', 'Number of pending bundles to fetch').default(20),
  )
  .addOption(
    new Option('-o, --offset', 'Offset of pending bundles to fetch').default(0),
  )
  .addOption(
    new Option(
      '--orchestrator-url',
      'The URL of the orchestrator server',
    ).default(ORCHESTRATOR_URL),
  )
  .addOption(
    new Option(
      '--orchestrator-api-key',
      'The API key for the orchestrator server',
    ).default(ORCHESTRATOR_API_KEY),
  )
  .action(async ({ count, offset, orchestratorUrl, orchestratorApiKey }) => {
    const orchestrator: Orchestrator = getOrchestrator(
      orchestratorApiKey,
      orchestratorUrl,
    )

    const { pendingBundles, nextOffset} = await orchestrator.getPendingBundles(count, offset)
    if (pendingBundles.length !== 0) {
      console.table(pendingBundles)
    } else {
      console.log('No pending bundles')
    }
    if (nextOffset) {
      console.log(`Next offset: ${nextOffset}`)
    }
  })

function parseBundleArgs(
  userAddress: string,
  targetChain: string,
  transfers: string[],
  { targetAccount, executions, userOp, accessList, accessListV1 },
): MetaIntent {
  targetAccount ??= userAddress
  let accountAccessList
  if (accessList) {
    if (accessListV1) {
      accountAccessList = accessList.map((access: string) => {
          const [chainId, tokenAddress] = access.split(':')
          return { chainId: parseInt(chainId), tokenAddress }
      })
    } else {
      accountAccessList = {
        chainTokens: accessList.reduce((acc, access: string) => {
          const [chainId, tokenSymbol] = access.split(':')
          if (!acc[parseInt(chainId)]) acc[chainId] = [tokenSymbol]
          else acc[parseInt(chainId)].push(tokenSymbol)
          return acc 
        }, {} as { [chainId: number]: Address[] })
      }
    }
  }

  console.log({ accessListV1, accountAccessList })
  const intent: MetaIntent = {
    targetChainId: parseInt(targetChain),
    tokenTransfers: transfers.map((transfer: string) => {
      const [tokenAddress, amount] = transfer.split(':')
      return { tokenAddress: tokenAddress as Address, amount: BigInt(amount) }
    }),
    targetAccount,
    targetExecutions: [],
    accountAccessList,
  }

  if (executions) {
    intent.targetExecutions = executions.map((execution: string) => {
      const [target, value, callData] = execution.split(':')
      return { target, value: BigInt(value), callData }
    })
  } else if (userOp) {
    intent.userOp = JSON.parse(userOp)
  }

  return intent
}

program.parse()
