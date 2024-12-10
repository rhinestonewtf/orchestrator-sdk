import { Address, Hex } from 'viem'

export type ChainAccountChallenge = {
  challengeRequired: boolean
  chainId: number
  account: Address
  challenge: string
}

export type Settlement = {
  orchestrator: Address
  recipient: Address
  settlementContract: Address
  targetAccount: Address
  targetChainId: number
  fillDeadline: number
  lastDepositId: bigint
}

export type TokenTransfer = {
  tokenAddress: Address
  amount: bigint
}

export type AcrossTransfer = {
  originExecutor: Address
  originAccount: Address
  originChainId: number
  initiateDeadline: number
  maxFee: bigint
  depositId: bigint
  originTransfer: TokenTransfer
  targetTransfer: TokenTransfer
}

export type SignedExecutions = {
  executions: Execution[]
}

export type MetaIntent = {
  targetChainId: number
  tokenTransfers: TokenTransfer[]
  targetAccount: Address
  targetExecutions: Execution[]
  userOp: PackedUserOperation
  accountAccessList?: {
    accountAddress: Address
    chainId: number
    tokenAddress: Address
  }[]
}

export type SignedIntent = {
  settlement: Settlement
  acrossTransfers: AcrossTransfer[]
  targetChainExecutions: SignedExecutions
  userOp: PackedUserOperation
}

export type SignedOrderBundle = {
  settlement: Settlement
  acrossTransfers: (AcrossTransfer & { userSignature: Hex })[]
  targetChainExecutions: SignedExecutions
  targetExecutionSignature: Hex
  userOp: PackedUserOperation
}

export type SignedIntentWithAuctionFee = {
  auctionFee: bigint
  signedIntent: SignedIntent
}

export type IndexChainDigest = {
  digestIndex: bigint
  chainDataDigests: Hex[]
}

export type SmartDigest = {
  acrossTransferDigests: IndexChainDigest
  executionDigest: Hex
  userOpDigest: Hex
}

export type OriginOrder = {
  settlement: Settlement
  acrossTransfer: AcrossTransfer
  smartDigests: SmartDigest
  userSig: Hex
}

export type OriginExecutorPayload = {
  order: OriginOrder
  auctionFee: bigint
  orchestratorSignature: Hex
  acrossMessagePayload: Hex
}

export type BundleEvent = {
  bundleId: string
  type: string
  standardDepositEvents: DepositEvent[]
  executionDepositEvent: DepositEvent
}

export type DepositEvent = {
  inputToken: Address // address
  outputToken: Address // address
  inputAmount: bigint // uint256
  outputAmount: bigint // uint256
  destinationChainId: number // uint256 (indexed)
  depositId: bigint // uint256 (indexed)
  quoteTimestamp: number // uint32
  fillDeadline: number // uint32
  exclusivityDeadline: number // uint32
  depositor: Address // address (indexed)
  recipient: Address // address
  exclusiveRelayer: Address // address
  message: string // bytes
}

export type Token = {
  symbol: string
  address: Address
  chainId: number
}

export type UserTokenBalance = {
  tokenName: string
  balance: string
  tokenChainBalance: {
    chainId: number
    tokenAddress: Address
    accountAddress: Address
    balance: string
  }[]
}

export enum BundleStatus {
  RECEIVED = 'RECEIVED',
  FILLED = 'FILLED',
  FINALIZED = 'FINALIZED',
  PARTIALLY_CLAIMED = 'PARTIALLY_CLAIMED',
  COMPLETE = 'COMPLETE',
  FAILED = 'FAILED',
  CLAIM_FAILED = 'CLAIM_FAILED',
  ERROR = 'ERROR',
}

export type Execution = {
  target: Address
  value: bigint
  callData: Hex
}

export type BundleIdStatus = {
  bundleStatus: string
  orderStatus: { depositId: bigint; status: string }[]
}

export type PackedUserOperation = {
  sender: Address
  nonce: bigint
  initCode: Hex
  callData: Hex
  accountGasLimits: Hex
  preVerificationGas: bigint
  gasFees: Hex
  paymasterAndData: Hex
  signature: Hex
}

export type Order = {
  settlement: Settlement
  acrossTransfer: AcrossTransfer
  smartDigests: SmartDigest
  userSig: Hex
}
