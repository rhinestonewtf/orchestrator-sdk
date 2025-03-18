import { zeroAddress } from 'viem'
import { UserOperation } from 'viem/account-abstraction'

export function getEmptyUserOp(): UserOperation<"0.7"> {
  return {
    sender: zeroAddress,
    nonce: 0n,
    callData: '0x',
    preVerificationGas: 0n,
    maxFeePerGas: 0n,
    maxPriorityFeePerGas: 0n,
    verificationGasLimit: 0n,
    callGasLimit: 0n,
    signature: '0x',
  }
}
