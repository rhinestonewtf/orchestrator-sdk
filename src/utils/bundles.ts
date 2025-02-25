import { Hex } from 'viem'
import type {
  MultiChainCompact,
  SignedMultiChainCompact,
  XchainExec,
} from '../types'

export function applyInjectedExecutions(orderPath: {
  orderBundle: MultiChainCompact
  injectedExecutions: XchainExec[]
}): MultiChainCompact {
  if (orderPath.injectedExecutions.length > 0) {
    orderPath.orderBundle.segments[0].witness.execs =
      orderPath.injectedExecutions.concat(
        orderPath.orderBundle.segments[0].witness.execs,
      )
  }
  return orderPath.orderBundle
}
