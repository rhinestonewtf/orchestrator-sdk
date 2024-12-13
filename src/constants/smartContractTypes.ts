export const smartContractTypes = {
  IndexChainDigest: [
    { name: 'digestIndex', type: 'uint256' },
    { name: 'chainDataDigests', type: 'bytes32[]' },
  ],
  SmartDigest: [
    { name: 'acrossTransferDigests', type: 'IndexChainDigest' },
    { name: 'executionDigest', type: 'bytes32' },
    { name: 'userOpDigest', type: 'bytes32' },
  ],
  Settlement: [
    { name: 'orchestrator', type: 'address' },
    { name: 'recipient', type: 'address' },
    { name: 'settlementContract', type: 'address' },
    { name: 'targetChainId', type: 'uint64' },
    { name: 'fillDeadline', type: 'uint32' },
    { name: 'lastDepositId', type: 'uint256' },
  ],
  TokenTransfer: [
    { name: 'tokenAddress', type: 'address' },
    { name: 'amount', type: 'uint256' },
  ],
  AcrossTransfer: [
    { name: 'originModule', type: 'address' },
    { name: 'originAccount', type: 'address' },
    { name: 'targetAccount', type: 'address' },
    { name: 'originChainId', type: 'uint64' },
    { name: 'initiateDeadline', type: 'uint32' },
    { name: 'maxFee', type: 'uint256' },
    { name: 'depositId', type: 'uint256' },
    { name: 'originTransfer', type: 'TokenTransfer' },
    { name: 'targetTransfer', type: 'TokenTransfer' },
  ],
  Order: [
    { name: 'settlement', type: 'Settlement' },
    { name: 'acrossTransfer', type: 'AcrossTransfer' },
    { name: 'smartDigests', type: 'SmartDigest' },
    { name: 'userSig', type: 'bytes' },
  ],
  OriginModulePayload: [
    { name: 'order', type: 'Order' },
    { name: 'auctionFee', type: 'uint256' },
    { name: 'orchestratorSig', type: 'bytes' },
    { name: 'acrossMessagePayload', type: 'bytes' },
  ],
  SignedIntent: [
    { name: 'settlement', type: 'Settlement' },
    { name: 'acrossTransfers', type: 'AcrossTransfer[]' },
    { name: 'targetChainExecutions', type: 'SignedExecutions' },
    { name: 'userOp', type: 'PackedUserOperation' },
  ],
  SignedIntentWithAuctionFee: [
    { name: 'auctionFee', type: 'uint256' },
    { name: 'signedIntent', type: 'SignedIntent' },
  ],
  Execution: [
    { name: 'target', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'callData', type: 'bytes' },
  ],
  SignedExecutions: [{ name: 'executions', type: 'Execution[]' }],
  PackedUserOperation: [
    { name: 'sender', type: 'address' },
    { name: 'nonce', type: 'uint256' },
    { name: 'initCode', type: 'bytes' },
    { name: 'callData', type: 'bytes' },
    { name: 'accountGasLimits', type: 'bytes32' },
    { name: 'preVerificationGas', type: 'uint256' },
    { name: 'gasFees', type: 'bytes32' },
    { name: 'paymasterAndData', type: 'bytes' },
    { name: 'signature', type: 'bytes' },
  ],
  WithdrawRequest: [
    { name: 'timestamp', type: 'uint32' },
    { name: 'tokenAddress', type: 'address' },
    { name: 'orchestrator', type: 'address' },
    { name: 'amount', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
  ],
  ApprovalSpend: [
    { name: 'account', type: 'address' },
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint256' },
  ],
  OmniLock: [
    { name: 'account', type: 'address' },
    { name: 'enabled', type: 'bool' },
  ],
  AcrossMessage: [
    {
      name: 'acrossMessage',
      type: 'tuple',
      components: [
        {
          name: 'settlement',
          type: 'tuple',
          components: [
            { name: 'orchestrator', type: 'address' },
            { name: 'recipient', type: 'address' },
            { name: 'settlementContract', type: 'address' },
            { name: 'targetChainId', type: 'uint64' },
            { name: 'fillDeadline', type: 'uint32' },
            { name: 'lastDepositId', type: 'uint256' },
          ],
        },
        {
          name: 'smartDigest',
          type: 'tuple',
          components: [
            {
              name: 'acrossTransferDigests',
              type: 'tuple',
              components: [
                { name: 'digestIndex', type: 'uint256' },
                { name: 'chainDataDigests', type: 'bytes32[]' },
              ],
            },
            { name: 'executionDigest', type: 'bytes32' },
            { name: 'userOpDigest', type: 'bytes32' },
          ],
        },
        {
          name: 'acrossTransfer',
          type: 'tuple',
          components: [
            { name: 'originModule', type: 'address' },
            { name: 'originAccount', type: 'address' },
            { name: 'targetAccount', type: 'address' },
            { name: 'originChainId', type: 'uint64' },
            { name: 'initiateDeadline', type: 'uint32' },
            { name: 'maxFee', type: 'uint256' },
            { name: 'depositId', type: 'uint256' },
            {
              name: 'originTransfer',
              type: 'tuple',
              components: [
                { name: 'tokenAddress', type: 'address' },
                { name: 'amount', type: 'uint256' },
              ],
            },
            {
              name: 'targetTransfer',
              type: 'tuple',
              components: [
                { name: 'tokenAddress', type: 'address' },
                { name: 'amount', type: 'uint256' },
              ],
            },
          ],
        },
        { name: 'acrossMessagePayload', type: 'bytes' },
      ],
    },
  ],
}
