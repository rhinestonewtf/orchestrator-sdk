import {
  encodeAbiParameters,
  encodePacked,
  Hex,
  keccak256,
  zeroHash,
} from 'viem'
import {
  AcrossTransfer,
  Execution,
  PackedUserOperation,
  Settlement,
  SignedExecutions,
  SignedIntent,
  SmartDigest,
  TokenTransfer,
} from '../types'
import { typehashTypes } from '../constants'

const ACROSS_TRANSFER_TYPEHASH =
  '0x2c207ea4e14283d6620837628d3aa63486714ffdf9bd83436f971b1157f5d51a'

const EXECUTION_TYPEHASH =
  '0x37fb04e5593580b36bfacc47d8b1a4b9a2acb88a513bf153760f925a6723d4b5'

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

export const hashOrchestratorBundle = (
  signedIntentDigest: Hex,
  auctionFee: bigint,
) => {
  return keccak256(
    encodeAbiParameters(typehashTypes.SignedIntentWithAuctionFee, [
      SIGNED_INTENT_WITH_AUCTION_FEE_TYPEHASH,
      auctionFee,
      signedIntentDigest,
    ]),
  )
}

export const hashTokenTransfer = (tokenTransfer: TokenTransfer) => {
  return keccak256(
    encodeAbiParameters(typehashTypes.TokenTransfer, [
      TOKEN_TRANSFER_TYPEHASH,
      tokenTransfer.tokenAddress,
      tokenTransfer.amount,
    ]),
  )
}
export const hashAcrossTransfers = (acrossTransfers: AcrossTransfer[]) => {
  return keccak256(
    encodePacked(['bytes32[]'], [acrossTransfers.map(hashAcrossTransfer)]),
  )
}

export const hashSettlement = (settlement: Settlement) => {
  return keccak256(
    encodeAbiParameters(typehashTypes.Settlement, [
      SETTLEMENT_TYPEHASH,
      settlement.orchestrator,
      settlement.recipient,
      settlement.settlementContract,
      settlement.targetChainId,
      settlement.fillDeadline,
      settlement.lastDepositId,
    ]),
  )
}

export const hashAcrossTransfer = (acrossTransfer: AcrossTransfer) => {
  return keccak256(
    encodeAbiParameters(typehashTypes.AcrossTransfer, [
      ACROSS_TRANSFER_TYPEHASH,
      acrossTransfer.originModule,
      acrossTransfer.originAccount,
      acrossTransfer.targetAccount,
      acrossTransfer.originChainId,
      acrossTransfer.initiateDeadline,
      acrossTransfer.maxFee,
      acrossTransfer.depositId,
      hashTokenTransfer(acrossTransfer.originTransfer),
      hashTokenTransfer(acrossTransfer.targetTransfer),
    ]),
  )
}
export const hashExecution = (execution: Execution) => {
  return keccak256(
    encodeAbiParameters(typehashTypes.Execution, [
      EXECUTION_TYPEHASH,
      execution.target,
      execution.value,
      keccak256(execution.callData), // Assuming callData needs to be hashed
    ]),
  )
}
export const hashSignedExecutions = (signedExecutions: SignedExecutions) => {
  return keccak256(
    encodeAbiParameters(typehashTypes.SignedExecutions, [
      SIGNED_EXECUTIONS_TYPEHASH,
      hashExecutionArray(signedExecutions.executions),
    ]),
  )
}
export const hashExecutionArray = (executionArray: Execution[]) => {
  const hashes = executionArray.map(hashExecution)
  return keccak256(encodePacked(['bytes32[]'], [hashes]))
}

export const hashPackedUserOperation = (
  packedUserOperation: PackedUserOperation,
) => {
  return keccak256(
    encodeAbiParameters(typehashTypes.PackedUserOperation, [
      SIGNED_USER_OP_TYPEHASH,
      packedUserOperation.sender,
      packedUserOperation.nonce,
      keccak256(packedUserOperation.initCode),
      keccak256(packedUserOperation.callData),
      packedUserOperation.accountGasLimits,
      packedUserOperation.preVerificationGas,
      packedUserOperation.gasFees,
      keccak256(packedUserOperation.paymasterAndData),
      keccak256(packedUserOperation.signature),
    ]),
  )
}

export const getSmartDigest = (
  digestIndex: bigint,
  orderBundle: SignedIntent,
) => {
  const userOpDigest = hashPackedUserOperation(orderBundle.userOp)

  const executionDigest = hashSignedExecutions({
    executions: orderBundle.targetChainExecutions.executions,
  })

  const smartDigest: SmartDigest = {
    userOpDigest: userOpDigest,
    executionDigest: executionDigest,
    acrossTransferDigests: {
      digestIndex: digestIndex,
      chainDataDigests: orderBundle.acrossTransfers.map((acrossTransfer) =>
        hashAcrossTransfer(acrossTransfer),
      ),
    },
  }

  return smartDigest
}
