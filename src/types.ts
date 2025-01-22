import { Address, Chain, Hex } from 'viem'

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
  targetChainId: number
  fillDeadline: number
  lastDepositId: bigint
}

export type TokenTransfer = {
  tokenAddress: Address
  amount: bigint
}

export type AcrossTransfer = {
  originModule: Address
  originAccount: Address
  targetAccount: Address
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
  omniLock?: boolean
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

export type OriginModulePayload = {
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
  destinationChainId: number
  originChainId: number
  depositId: bigint // uint256 (indexed)
  quoteTimestamp: number // uint32
  fillDeadline: number // uint32
  exclusivityDeadline: number // uint32
  depositor: Address // address (indexed)
  recipient: Address // address
  exclusiveRelayer: Address // address
  message: string // bytes
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

export type BundleIdStatus = {
  bundleStatus: string
  orderStatus: { depositId: bigint; status: string }[]
}

export enum OrderStatus { // See prisma schema
  RECEIVED = 'RECEIVED',
  FILLED = 'FILLED',
  FINALIZED = 'FINALIZED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

type FinishedBundleStatus =
  | BundleStatus.COMPLETE
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

export type Execution = {
  target: Address
  value: bigint
  callData: Hex
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

export type ChainAccount = {
  chainId: number
  accountAddress: Address
}
