import {
  getOwnableValidatorSignature,
  OWNABLE_VALIDATOR_ADDRESS,
} from '@rhinestone/module-sdk'
import { hashTypedData, Hex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { SignedIntent, SignedOrderBundle } from '../types'
import { smartContractTypes } from '../constants'
import { getOrderDomain } from '../utils'


export async function signOrderBundleWithOwnableValidator(
  orderBundle: SignedIntent,
  privateKey: Hex,
): Promise<SignedOrderBundle> {
  const hash = hashTypedData({
    domain: getOrderDomain(),
    types: smartContractTypes,
    primaryType: 'SignedIntent',
    message: orderBundle,
  })

  const account = privateKeyToAccount(privateKey)

  // Add the prefix for ownable validator sig
  const signature = await account.signMessage({
    message: {
      raw: hash,
    },
  })

  const ownableValidatorSig = getOwnableValidatorSignature({
    signatures: [signature],
  })

  const encodedSignature = (OWNABLE_VALIDATOR_ADDRESS +
    ownableValidatorSig.slice(2)) as Hex

  return {
    settlement: orderBundle.settlement,
    acrossTransfers: orderBundle.acrossTransfers.map((transfer) => ({
      ...transfer,
      userSignature: encodedSignature,
    })),
    targetChainExecutions: orderBundle.targetChainExecutions,
    targetExecutionSignature: encodedSignature,
    userOp: orderBundle.userOp,
  }
}
