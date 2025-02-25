import {
  Address,
  encodeAbiParameters,
  encodePacked,
  hashTypedData,
  Hex,
  keccak256,
} from 'viem'
import { Execution, IntentFillPayload, MultiChainCompact, Segment, SignedMultiChainCompact, TokenArrays6909, Witness } from '../types'
import { typehashTypes, getRhinestoneSpokePoolAddress, smartContractTypes, getHookAddress } from '../constants'
import { getCompactDomainSeparator, getExecutions, getRhinestoneSpokepoolDomain } from '../utils'

const MULTICHAIN_COMPACT_TYPEHASH =
  '0xee54591377b86e048be6b2fbd8913598a6270aed3415776321279495bf4efae5'
const SEGMENT_TYPEHASH =
  '0x54ada5b33a7390e2883c985295cfa2dcd9bb46515ad10cbdfc22a7c73f9807db'
const WITNESS_TYPEHASH =
  '0x78e29a727cef567e7d6dddf5bf7eedf0c84af60d4a57512c586c787aae731629'
const EXECUTION_TYPEHASH =
  '0xa222cbaaad3b88446c3ca031429dafb24afdbda10c5dbd9882c294762857141a'

const ACROSS_TRANSFER_TYPEHASH =
  '0x2c207ea4e14283d6620837628d3aa63486714ffdf9bd83436f971b1157f5d51a'

const SIGNED_EXECUTIONS_TYPEHASH =
  '0xe7ceef5557a675caf34313bd56c0d0952522a89ffc3efbe1ce6a9fca2257c0a3'

const SETTLEMENT_TYPEHASH =
  '0xe680c32212011b4cde9e79c36057dcc1e0ab19fd4adb2b0a3bfece44cd645533'

const TOKEN_TRANSFER_TYPEHASH =
  '0xef3136c9bbc8441e191dc61c253d9479f54ef95a64b36b8581d51a156f7512c4'

const SIGNED_INTENT_TYPEHASH =
  '0x9bafa23b0ee7874c656c66202e7ff9c0f6b794631cfff0a50b9bdd2041f1d4be'

const SIGNED_INTENT_WITH_AUCTION_FEE_TYPEHASH =
  '0xa0abe415300d58e370d7d8eb5507aa75764fb2d77d9d91ee92a3415ad1b22a37'

const SIGNED_USER_OP_TYPEHASH =
  '0x81264956c7c6625e9c85b65ea4d4eaeb56247ec77f1b277e3635a99ff98b11c2'


export const hashExecution = (execution: Execution) => {
  return keccak256(
    encodeAbiParameters(typehashTypes.Execution, [
      EXECUTION_TYPEHASH,
      execution.target,
      execution.value,
      keccak256(execution.callData),
    ]),
  )
}

export const hashExecutionArray = (executionArray: Execution[]) => {
  const hashes = executionArray.map(hashExecution)
  return keccak256(encodePacked(['bytes32[]'], [hashes]))
}

export const hashWitness = (witness: Witness): Hex => {
  return keccak256(
    encodeAbiParameters(
      [
        { name: 'typehash', type: 'bytes32' },
        { name: 'recipient', type: 'address' },
        { name: 'tokenOut', type: 'bytes32' },
        { name: 'depositId', type: 'uint256' },
        { name: 'targetChain', type: 'uint256' },
        { name: 'fillDeadline', type: 'uint32' },
        { name: 'execs', type: 'bytes32' }, // Assuming XchainExec[] is complex
        { name: 'userOpHash', type: 'bytes32' },
        { name: 'maxFeeBps', type: 'uint32' },
      ],
      [
        WITNESS_TYPEHASH,
        witness.recipient,
        hashIdsAndAmounts(witness.tokenOut),
        witness.depositId,
        witness.targetChain,
        witness.fillDeadline,
        // TODO: Figure out if this is correct after the to, value, data BS
        hashExecutionArray(getExecutions(witness.execs)),
        witness.userOpHash,
        witness.maxFeeBps,
      ],
    ),
  )
}

export const hashFeeBeneficiary = (
  feeBeneficiaryAndBps: TokenArrays6909,
): Hex => {
  return keccak256(encodePacked(['uint256[2][]'], [feeBeneficiaryAndBps]))
}

export const hashIdsAndAmounts = (idsAndAmounts: TokenArrays6909): Hex => {
  // TODO: Check if this is correct
  return keccak256(encodePacked(['uint256[2][]'], [idsAndAmounts]))
}

export const hashMultiChainCompactWithDomainSeparator = (
  multiChainCompact: MultiChainCompact,
  domainSeparator: Hex,
): Hex => {
  //         return keccak256(abi.encodePacked("\x19\x01", domainSeparator, hash));
  return keccak256(
    encodePacked(
      ['string', 'bytes32', 'bytes32'],
      [
        '\x19\x01',
        domainSeparator,
        hashMultichainCompactWithoutDomainSeparator(multiChainCompact),
      ],
    ),
  )
}

export const hashMultichainCompactWithoutDomainSeparator = (
  multiChainCompact: MultiChainCompact,
): Hex => {
  return keccak256(
    encodeAbiParameters(
      [
        { name: 'typehash', type: 'bytes32' },
        { name: 'sponsor', type: 'address' },
        { name: 'nonce', type: 'uint256' },
        { name: 'expires', type: 'uint256' },
        { name: 'segments', type: 'bytes32' },
      ],
      [
        MULTICHAIN_COMPACT_TYPEHASH,
        multiChainCompact.sponsor,
        multiChainCompact.nonce,
        multiChainCompact.expires,
        hashSegments([...multiChainCompact.segments]),
      ],
    ),
  )
}

export const hashSegments = (segment: Segment[]): Hex => {
  return keccak256(encodePacked(['bytes32[]'], [segment.map(hashSegment)]))
}

export const hashSegment = (segment: Segment): Hex => {
  return keccak256(
    encodeAbiParameters(
      [
        { name: 'typehash', type: 'bytes32' },
        { name: 'arbiter', type: 'address' },
        { name: 'chainId', type: 'uint256' },
        { name: 'idsAndAmounts', type: 'bytes32' },
        { name: 'witness', type: 'bytes32' },
      ],
      [
        SEGMENT_TYPEHASH,
        segment.arbiter,
        segment.chainId,
        hashIdsAndAmounts(segment.idsAndAmounts),
        hashWitness(segment.witness),
      ],
    ),
  )
}

export const getSegmentHashes = (
  signedMultiChainCompact: SignedMultiChainCompact,
): Hex[] => {
  return signedMultiChainCompact.segments.map(hashSegment)
}

export const getOtherSegmentHashes = (
  signedMultiChainCompact: SignedMultiChainCompact,
): Hex[] => {
  // Return all segment hashes except for the first one
  return getSegmentHashes(signedMultiChainCompact).slice(1)
}

export const hashIntentFillPayload = (
  targetChainId: number,
  payload: IntentFillPayload,
  exclusiveRelayer: Address,
): Hex => {
  const abiItem = [
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
  ]
  // Hash the segments and message
  const intentFillPayloadArrayKeccak = keccak256(
    encodeAbiParameters(abiItem, [payload.segments, payload.message]),
  )

  return hashTypedData({
    domain: getRhinestoneSpokepoolDomain(
      targetChainId,
      getRhinestoneSpokePoolAddress(targetChainId),
    ),
    types: smartContractTypes,
    primaryType: 'AtomicFill',
    message: {
      intentFillPayloadArrayKeccak,
      exclusiveRelayer,
    },
  })
}

