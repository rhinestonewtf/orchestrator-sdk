import { createPublicClient, http, StateOverride, zeroAddress } from 'viem'
import { MetaIntent } from '../types'
import { getHookAddress } from '../constants/registry'
import { UserOperation } from 'viem/account-abstraction'

export async function getStateOverride(
  intent: MetaIntent,
): Promise<StateOverride> {
  return [
    {
      address: getHookAddress(intent.targetChainId),
      // TODO: replace this with bytecode of the unlocked contract
      code: '0x',
    },
  ]
}

export async function addIntentOverhead(
  intent: MetaIntent,
  userOp: UserOperation<'0.7'>,
): Promise<UserOperation<'0.7'>> {
  const UNLOCK_GAS = 100_000n
  const CALLBACK_GAS = 100_000n
  const WETH_UNWRAP_GAS = 100_000n

  const unlockInjectedExecutionGas =
    BigInt(intent.tokenTransfers.length) * UNLOCK_GAS

  if (
    intent.tokenTransfers.some(
      (transfer) => transfer.tokenAddress === zeroAddress,
    )
  ) {
    userOp.callGasLimit += WETH_UNWRAP_GAS
  }

  userOp.callGasLimit += unlockInjectedExecutionGas + CALLBACK_GAS
  // TODO: Might need to add gas here for pre validation hooks

  return userOp
}
