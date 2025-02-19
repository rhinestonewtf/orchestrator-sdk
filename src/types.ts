import { Address, Chain, Hex } from 'viem'
import type { UserOperation } from 'viem/account-abstraction'

// TODO: these types need to be updated to the latest contract structs
export type MultiChainCompact = {
  sponsor: Address
  nonce: bigint
  expires: bigint
  segments: Segment[]
}

export type Segment = {
  arbiter: Address
  chainId: bigint
  idsAndAmounts: [bigint, bigint][]
  witness: Witness
}

export type Witness = {
  recipient: Address
  tokenOut: [bigint, bigint][]
  depositId: bigint
  targetChain: bigint
  fillDeadline: number
  execs: XchainExec[]
  userOpHash: Hex
}

export type XchainExec = {
  target: Address
  value: bigint
  callData: Hex
}

export type BatchCompact = {
  arbiter: Address
  sponsor: Address
  nonce: bigint
  expires: bigint
  idsAndAmounts: [bigint, bigint][]
  witness: Witness
}

export type QualificationWitness = {
  claimHash: Hex
  targetChainSignatureHash: Hex
  targetWETHAddress: Address
}

export type ChainNotarization = {
  originAccount: Address
  originModule: Address
  notarizedChainId: bigint
  nonce: bigint
  expires: bigint
  notarizedWitness: Hex
  idsAndAmountsTokenInHash: Hex
}

export type TargetChainAttributes = {
  recipient: Address
  tokenOut: [bigint, bigint][]
  targetWETHAddress: Address
  depositId: bigint
  fillDeadline: number
}

export type MultiOriginMessage = {
  notarization: ChainNotarization
  targetChain: TargetChainAttributes
  otherSegments: Hex[]
  executions: Execution[]
  userSig: Hex
}

export type SingleOriginMessage = {
  notarization: ChainNotarization
  targetChain: TargetChainAttributes
  executions: Execution[]
  userSig: Hex
}

export type UserOperationMessage = {
  targetChain: TargetChainAttributes
  userOp: PackedUserOperation
  nonce: bigint
}

export type Execution = {
  target: Address
  value: bigint
  callData: Hex
}

export type IntentFillPayload = {
  segments: SegmentData[]
  message: Hex
  orchestratorSig: Hex
}

export type SegmentData = {
  tokenIn: [bigint, bigint][]
  tokenOut: [bigint, bigint][]
  originWETHAddress: Address
  originChainId: bigint
  baseDepositId: bigint
}

export type SignedMultiChainCompact = MultiChainCompact & {
  originSignatures: Hex[]
  targetSignature: Hex
}

export type TokenTransfer = {
  tokenAddress: Address
  amount: bigint
}

type WithUserOp = {
  userOp: UserOperation
  targetExecutions?: never
}

type WithExecutions = {
  userOp?: never
  targetExecutions: Execution[]
}

type WithoutOperation = {
  userOp?: never
  targetExecutions?: never
}

type MetaIntentBase = {
  targetChainId: number
  tokenTransfers: TokenTransfer[]
  targetAccount: Address
  accountAccessList?: {
    chainId: number
    tokenAddress: Address
  }[]
  omniLock?: boolean
}

export type MetaIntentEmpty = MetaIntentBase & WithoutOperation
export type MetaIntentWithUserOp = MetaIntentBase & WithUserOp
export type MetaIntentWithExecutions = MetaIntentBase & WithExecutions

export type MetaIntent =
  | MetaIntentEmpty
  | MetaIntentWithUserOp
  | MetaIntentWithExecutions

export type BundleEvent = {
  bundleId: string
  type: string
  targetFillPayload: Execution
  standardDepositEvents: DepositEvent[]
  executionDepositEvent: DepositEvent
}

export type DepositEvent = {
  originClaimPayload: Execution
  inputToken: Address // address
  outputToken: Address // address
  inputAmount: bigint // uint256
  outputAmount: bigint // uint256
  destinationChainId: number
  originChainId: number
  depositId: bigint // uint256 (indexed)
  quoteTimestamp: number // uint32
  fillDeadline: number // uint32
  exclusivityDeadline: number // uint32
  depositor: Address // address (indexed)
  recipient: Address // address
  exclusiveRelayer: Address // address
  message: Hex // bytes
}

export type SignedTokenUnlock = {
  chainId: number
  tokenAddress: Address
  amount: bigint
  timestamp: number
  nonce: bigint
  signature: Hex
  verifyingContract: Address
}

export type Token = {
  symbol: string
  address: Address
  chainId: number
}

export type UserTokenBalance = {
  tokenName: string
  tokenDecimals: number
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
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CLAIM_FAILED = 'CLAIM_FAILED',
  ERROR = 'ERROR',
}

export enum OrderStatus { // See prisma schema
  RECEIVED = 'RECEIVED',
  FILLED = 'FILLED',
  FINALIZED = 'FINALIZED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

type FinishedBundleStatus =
  | BundleStatus.COMPLETED
  | BundleStatus.FILLED
  | BundleStatus.FINALIZED
  | BundleStatus.PARTIALLY_CLAIMED

export type GetBundleResult =
  | InProgressBundleResult
  | FinishedBundleResult
  | FailedBundleResult

type OrderResult = {
  depositId: bigint
  status: OrderStatus
}

type InProgressBundleResult = {
  bundleStatus: BundleStatus.RECEIVED
  orderStatus: OrderResult[]
}

type FinishedBundleResult = {
  bundleStatus: FinishedBundleStatus
  fillTransactionHash: Hex
  orderStatus: OrderResult[]
}

type FailedBundleResult = {
  bundleStatus: BundleStatus.FAILED | BundleStatus.ERROR
  orderStatus: OrderResult[]
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

export type OrchestratorChainConfig = {
  rpcUrl: string
  viemChain: Chain
  spokepool: Address
  hook: Address
  originModule: Address
  targetModule: Address
  weth: Address
  supportedTokens: TokenConfig[]
}

export type TokenConfig = {
  symbol: string
  address: Address
  decimals: number
}
