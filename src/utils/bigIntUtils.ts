import { Address, Hex } from 'viem'
import { Segment, Execution, MultiChainCompact, BundleEvent } from '../types'

export function convertBigIntFields(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (typeof obj === 'bigint') {
    return obj.toString()
  }

  if (Array.isArray(obj)) {
    return obj.map(convertBigIntFields)
  }

  if (typeof obj === 'object') {
    const result: any = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = convertBigIntFields(obj[key])
      }
    }
    return result
  }

  return obj
}

export function parseCompactResponse(response: any): MultiChainCompact {
  return {
    sponsor: response.sponsor as Address,
    nonce: BigInt(response.nonce),
    expires: BigInt(response.expires),
    segments: response.segments.map((segment: any) => {
      return {
        arbiter: segment.arbiter as Address,
        chainId: BigInt(segment.chainId),
        idsAndAmounts: segment.idsAndAmounts.map((idsAndAmount: any) => {
          return [BigInt(idsAndAmount[0]), BigInt(idsAndAmount[1])]
        }),
        witness: {
          recipient: segment.witness.recipient as Address,
          tokenOut: segment.witness.tokenOut.map((tokenOut: any) => {
            return [BigInt(tokenOut[0]), BigInt(tokenOut[1])]
          }),
          depositId: BigInt(segment.witness.depositId),
          targetChain: BigInt(segment.witness.targetChain),
          fillDeadline: segment.witness.fillDeadline,
          execs: segment.witness.execs.map((exec: any) => {
            return {
              to: exec.to as Address,
              value: BigInt(exec.value),
              data: exec.data as Hex,
            } as Execution
          }),
          userOpHash: segment.witness.userOpHash as Hex,
          maxFeeBps: segment.witness.maxFeeBps,
        },
      } as Segment
    }),
  } as MultiChainCompact
}

export function parsePendingBundleEvent(response: any): BundleEvent {
  return {
    type: response.type,
    bundleId: BigInt(response.bundleId),
    targetFillPayload: {
      to: response.targetFillPayload.to as Address,
      data: response.targetFillPayload.data as Hex,
      value: BigInt(response.targetFillPayload.value),
      chainId: response.targetFillPayload.chainId,
    },
    acrossDepositEvents: response.acrossDepositEvents.map((event: any) => {
      return {
        message: event.message,
        depositId: BigInt(event.depositId),
        depositor: event.depositor as Address,
        recipient: event.recipient as Address,
        inputToken: event.inputToken as Address,
        inputAmount: BigInt(event.inputAmount),
        outputToken: event.outputToken as Address,
        fillDeadline: event.fillDeadline,
        outputAmount: BigInt(event.outputAmount),
        quoteTimestamp: event.quoteTimestamp,
        exclusiveRelayer: event.exclusiveRelayer as Address,
        destinationChainId: event.destinationChainId,
        originClaimPayload: {
          to: event.originClaimPayload.to as Address,
          data: event.originClaimPayload.data as Hex,
          value: BigInt(event.originClaimPayload.value),
          chainId: event.originClaimPayload.chainId,
        },
        exclusivityDeadline: event.exclusivityDeadline,
      }
    }),
  }
}
