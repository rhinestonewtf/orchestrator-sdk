import { Hex } from 'viem'
import { getHookAddress } from '../constants'
import { getCompactDomainSeparator } from '../utils'
import { MultiChainCompact, SignedMultiChainCompact } from '../types'
import { hashMultiChainCompactWithDomainSeparator } from './hash'

export function getOrderBundleHash(
  orderBundle: MultiChainCompact,
): Hex {
  const notarizedChainId = Number(orderBundle.segments[0].chainId)
  return hashMultiChainCompactWithDomainSeparator(
    orderBundle,
    getCompactDomainSeparator(
      notarizedChainId,
      getHookAddress(notarizedChainId),
    ),
  )
}

export function getSignedOrderBundle(
  orderBundle: MultiChainCompact,
  orderBundleSignature: Hex,
): SignedMultiChainCompact {
  return {
    ...orderBundle,
    originSignatures: Array(orderBundle.segments.length).fill(
      orderBundleSignature,
    ),
    targetSignature: orderBundleSignature,
  }
}
