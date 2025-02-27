import {
  Address,
  concatHex,
  decodeAbiParameters,
  encodeAbiParameters,
  Hex,
  zeroAddress,
} from 'viem'
import type {
  MultiChainCompact,
  Execution,
  ChainExecution,
  IntentFillPayload,
  SegmentData,
} from '../types'
import { getRhinestoneSpokePoolAddress } from '../constants'

export function applyInjectedExecutions(orderPath: {
  orderBundle: MultiChainCompact
  injectedExecutions: Execution[]
}): MultiChainCompact {
  if (orderPath.injectedExecutions.length > 0) {
    orderPath.orderBundle.segments[0].witness.execs =
      orderPath.injectedExecutions.concat(
        orderPath.orderBundle.segments[0].witness.execs,
      )
  }
  return orderPath.orderBundle
}

export function updateTargetFillPayload(
  targetFillPayload: ChainExecution,
  repaymentAddress: Address | Address[],
  repaymentChainIds: number | number[],
): ChainExecution {
  const abiItem = {
    type: 'function',
    name: 'fill',
    inputs: [
      {
        name: 'payload',
        type: 'tuple',
        internalType: 'struct IRhinestoneSpokePool.IntentFillPayload',
        components: [
          {
            name: 'segments',
            type: 'tuple[]',
            internalType: 'struct IRhinestoneSpokePool.SegmentData[]',
            components: [
              {
                name: 'tokenIn',
                type: 'uint256[2][]',
                internalType: 'uint256[2][]',
              },
              {
                name: 'tokenOut',
                type: 'uint256[2][]',
                internalType: 'uint256[2][]',
              },
              {
                name: 'originWETHAddress',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'originChainId',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'compactNonce',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          { name: 'message', type: 'bytes', internalType: 'bytes' },
          {
            name: 'orchestratorSig',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
      {
        name: 'exclusiveRelayer',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'repaymentAddresses',
        type: 'address[]',
        internalType: 'address[]',
      },
      {
        name: 'repaymentChainIds',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  }

  const selector = targetFillPayload.data.slice(0, 10)
  const data = targetFillPayload.data.slice(10)
  if (
    targetFillPayload.to !==
    getRhinestoneSpokePoolAddress(targetFillPayload.chainId)
  ) {
    throw new Error(
      `Target fill payload to address: ${targetFillPayload.to} does not match expected address: ${getRhinestoneSpokePoolAddress(
        targetFillPayload.chainId,
      )} on chain: ${targetFillPayload.chainId}`,
    )
  }

  const [intentFillPayload, ...args] = decodeAbiParameters(
    abiItem.inputs,
    ('0x' + data) as Hex,
  )

  const numberOfDeposits = (
    intentFillPayload as IntentFillPayload
  ).segments.reduce((count: number, segment: SegmentData) => {
    return count + segment.tokenIn.length
  }, 0)

  if (
    Array.isArray(repaymentAddress) &&
    repaymentAddress.length !== numberOfDeposits
  ) {
    throw new Error(
      `Repayment address array length: ${repaymentAddress.length} does not match expected length: ${repaymentAddress.length}`,
    )
  } else if (typeof repaymentAddress === 'string') {
    repaymentAddress = [repaymentAddress]
  }

  if (
    Array.isArray(repaymentChainIds) &&
    repaymentChainIds.length !== numberOfDeposits
  ) {
    throw new Error(
      `Repayment chainIds array length: ${repaymentChainIds.length} does not match expected length: ${repaymentChainIds.length}`,
    )
  } else if (typeof repaymentChainIds === 'number') {
    repaymentChainIds = [repaymentChainIds]
  }

  const updatedData = concatHex([
    selector as Hex,
    encodeAbiParameters(abiItem.inputs, [
      intentFillPayload,
      zeroAddress,
      repaymentAddress,
      repaymentChainIds,
    ]),
  ])

  return {
    to: targetFillPayload.to,
    value: targetFillPayload.value,
    data: updatedData,
    chainId: targetFillPayload.chainId,
  }
}
