import {
  getOrchestrator,
  Orchestrator,
  MetaIntent,
  UserTokenBalance,
  hashMultiChainCompact,
  applyInjectedExecutions,
  applyNotarizedSignature,
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
              accountAddress: chainBalance.accountAddress,
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
      console.log(JSON.stringify(orderBundle, null, 2))
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
        const messageHash = hashMultiChainCompact(updatedOrderBundle)
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

        const signedOrderBundle = applyNotarizedSignature(
          updatedOrderBundle,
          encodedSignature,
        )

        return { signedOrderBundle }
      }),
    )
    const result = await orchestrator.postSignedOrderBundle(bundles)
    console.log(JSON.stringify(result, null, 2))
  })

program
  .command('status')
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

function parseBundleArgs(
  userAddress: string,
  targetChain: string,
  transfers: string[],
  { targetAccount, executions, userOp, accessList },
): MetaIntent {
  targetAccount ??= userAddress
  let accountAccessList
  if (accessList) {
    accountAccessList = accessList.map((access: string) => {
      const [chainId, tokenAddress] = access.split(':')
      return { chainId: parseInt(chainId), tokenAddress }
    })
  }
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
