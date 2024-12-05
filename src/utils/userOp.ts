import { zeroAddress, zeroHash } from 'viem'
import { PackedUserOperation } from '../types'

export function getEmptyUserOp(): PackedUserOperation {
  return {
    sender: zeroAddress,
    nonce: 0n,
    initCode: '0x',
    callData: '0x',
    accountGasLimits: zeroHash,
    preVerificationGas: 0n,
    gasFees: zeroHash,
    paymasterAndData: '0x',
    signature: '0x',
  }
}
