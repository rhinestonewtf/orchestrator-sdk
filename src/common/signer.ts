import { hashTypedData, Hex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { SignedIntent, SignedOrderBundle } from '../types'
import { smartContractTypes } from '../constants'
import { getOrderDomain } from '../utils'

export async function getOrderBundleHash(
  orderBundle: SignedIntent,
): Promise<Hex> {
  return hashTypedData({
    domain: getOrderDomain(),
    types: smartContractTypes,
    primaryType: 'SignedIntent',
    message: orderBundle,
  })
}

export async function getSignedOrderBundle(
  orderBundle: SignedIntent,
  orderBundleSignature: Hex,
): Promise<SignedOrderBundle> {
  return {
    settlement: orderBundle.settlement,
    acrossTransfers: orderBundle.acrossTransfers.map((transfer) => ({
      ...transfer,
      userSignature: orderBundleSignature,
    })),
    targetChainExecutions: orderBundle.targetChainExecutions,
    targetExecutionSignature: orderBundleSignature,
    userOp: orderBundle.userOp,
  }
}
