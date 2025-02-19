import { UserTokenBalance } from '../src'
import { MetaIntent } from '../src'
import { getOrchestrator, Orchestrator } from '../src'
import { Command, Option } from 'commander'

const orchestrator: Orchestrator = getOrchestrator(
  process.env.ORCHESTRATOR_API_KEY!,
  process.env.ORCHESTRATOR_URL,
)

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
  .action(async (userAddress, { chainIds, tokens }) => {
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
  })

program
  .command('path')
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
  .action(
    async (
      userAddress,
      targetChain,
      transfers,
      { targetAccount, executions, userOp, accessList },
    ) => {
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
          return { tokenAddress, amount: BigInt(amount) }
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

      const { orderBundle, injectedExecutions } =
        await orchestrator.getOrderPath(intent, userAddress)
      console.log(JSON.stringify(orderBundle))
    },
  )

program
  .command('status')
  .description('Get the status of a bundle')
  .argument('<bundleId>', 'The ID of the bundle')
  .action(async (bundleId) => {
    const status = await orchestrator.getBundleStatus(bundleId)
    console.log(status)
  })

program.parse()
