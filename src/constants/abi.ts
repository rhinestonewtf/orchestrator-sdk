export const originExecutorAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'orchestrator',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'resourceLock',
        type: 'address',
        internalType: 'contract IAccountLocker',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'SPOKEPOOL',
    inputs: [],
    outputs: [
      { name: '', type: 'address', internalType: 'contract ISpokePool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'eip712Domain',
    inputs: [],
    outputs: [
      { name: 'fields', type: 'bytes1', internalType: 'bytes1' },
      { name: 'name', type: 'string', internalType: 'string' },
      { name: 'version', type: 'string', internalType: 'string' },
      { name: 'chainId', type: 'uint256', internalType: 'uint256' },
      {
        name: 'verifyingContract',
        type: 'address',
        internalType: 'address',
      },
      { name: 'salt', type: 'bytes32', internalType: 'bytes32' },
      {
        name: 'extensions',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'handleAcross',
    inputs: [
      {
        name: 'payload',
        type: 'tuple',
        internalType: 'struct OriginExecutorPayload',
        components: [
          {
            name: 'order',
            type: 'tuple',
            internalType: 'struct Order',
            components: [
              {
                name: 'settlement',
                type: 'tuple',
                internalType: 'struct Settlement',
                components: [
                  {
                    name: 'orchestrator',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'recipient',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'settlementContract',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'targetAccount',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'targetChainId',
                    type: 'uint64',
                    internalType: 'uint64',
                  },
                  {
                    name: 'fillDeadline',
                    type: 'uint32',
                    internalType: 'uint32',
                  },
                  {
                    name: 'lastDepositId',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                ],
              },
              {
                name: 'acrossTransfer',
                type: 'tuple',
                internalType: 'struct AcrossTransfer',
                components: [
                  {
                    name: 'originExecutor',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'originAccount',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'originChainId',
                    type: 'uint64',
                    internalType: 'uint64',
                  },
                  {
                    name: 'initiateDeadline',
                    type: 'uint32',
                    internalType: 'uint32',
                  },
                  {
                    name: 'maxFee',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'depositId',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'originTransfer',
                    type: 'tuple',
                    internalType: 'struct TokenTransfer',
                    components: [
                      {
                        name: 'tokenAddress',
                        type: 'address',
                        internalType: 'address',
                      },
                      {
                        name: 'amount',
                        type: 'uint256',
                        internalType: 'uint256',
                      },
                    ],
                  },
                  {
                    name: 'targetTransfer',
                    type: 'tuple',
                    internalType: 'struct TokenTransfer',
                    components: [
                      {
                        name: 'tokenAddress',
                        type: 'address',
                        internalType: 'address',
                      },
                      {
                        name: 'amount',
                        type: 'uint256',
                        internalType: 'uint256',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'smartDigests',
                type: 'tuple',
                internalType: 'struct SmartDigest',
                components: [
                  {
                    name: 'acrossTransferDigests',
                    type: 'tuple',
                    internalType: 'struct IndexChainDigest',
                    components: [
                      {
                        name: 'digestIndex',
                        type: 'uint256',
                        internalType: 'uint256',
                      },
                      {
                        name: 'chainDataDigests',
                        type: 'bytes32[]',
                        internalType: 'bytes32[]',
                      },
                    ],
                  },
                  {
                    name: 'executionDigest',
                    type: 'bytes32',
                    internalType: 'bytes32',
                  },
                  {
                    name: 'userOpDigest',
                    type: 'bytes32',
                    internalType: 'bytes32',
                  },
                ],
              },
              { name: 'userSig', type: 'bytes', internalType: 'bytes' },
            ],
          },
          {
            name: 'auctionFee',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'orchestratorSig',
            type: 'bytes',
            internalType: 'bytes',
          },
          {
            name: 'acrossMessagePayload',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'handleAcross',
    inputs: [
      {
        name: 'payload',
        type: 'tuple[]',
        internalType: 'struct OriginExecutorPayload[]',
        components: [
          {
            name: 'order',
            type: 'tuple',
            internalType: 'struct Order',
            components: [
              {
                name: 'settlement',
                type: 'tuple',
                internalType: 'struct Settlement',
                components: [
                  {
                    name: 'orchestrator',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'recipient',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'settlementContract',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'targetAccount',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'targetChainId',
                    type: 'uint64',
                    internalType: 'uint64',
                  },
                  {
                    name: 'fillDeadline',
                    type: 'uint32',
                    internalType: 'uint32',
                  },
                  {
                    name: 'lastDepositId',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                ],
              },
              {
                name: 'acrossTransfer',
                type: 'tuple',
                internalType: 'struct AcrossTransfer',
                components: [
                  {
                    name: 'originExecutor',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'originAccount',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'originChainId',
                    type: 'uint64',
                    internalType: 'uint64',
                  },
                  {
                    name: 'initiateDeadline',
                    type: 'uint32',
                    internalType: 'uint32',
                  },
                  {
                    name: 'maxFee',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'depositId',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'originTransfer',
                    type: 'tuple',
                    internalType: 'struct TokenTransfer',
                    components: [
                      {
                        name: 'tokenAddress',
                        type: 'address',
                        internalType: 'address',
                      },
                      {
                        name: 'amount',
                        type: 'uint256',
                        internalType: 'uint256',
                      },
                    ],
                  },
                  {
                    name: 'targetTransfer',
                    type: 'tuple',
                    internalType: 'struct TokenTransfer',
                    components: [
                      {
                        name: 'tokenAddress',
                        type: 'address',
                        internalType: 'address',
                      },
                      {
                        name: 'amount',
                        type: 'uint256',
                        internalType: 'uint256',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'smartDigests',
                type: 'tuple',
                internalType: 'struct SmartDigest',
                components: [
                  {
                    name: 'acrossTransferDigests',
                    type: 'tuple',
                    internalType: 'struct IndexChainDigest',
                    components: [
                      {
                        name: 'digestIndex',
                        type: 'uint256',
                        internalType: 'uint256',
                      },
                      {
                        name: 'chainDataDigests',
                        type: 'bytes32[]',
                        internalType: 'bytes32[]',
                      },
                    ],
                  },
                  {
                    name: 'executionDigest',
                    type: 'bytes32',
                    internalType: 'bytes32',
                  },
                  {
                    name: 'userOpDigest',
                    type: 'bytes32',
                    internalType: 'bytes32',
                  },
                ],
              },
              { name: 'userSig', type: 'bytes', internalType: 'bytes' },
            ],
          },
          {
            name: 'auctionFee',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'orchestratorSig',
            type: 'bytes',
            internalType: 'bytes',
          },
          {
            name: 'acrossMessagePayload',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'hashApprovalSpend',
    inputs: [
      {
        name: 'request',
        type: 'tuple',
        internalType: 'struct ApprovalSpend',
        components: [
          { name: 'account', type: 'address', internalType: 'address' },
          { name: 'token', type: 'address', internalType: 'address' },
          { name: 'amount', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'hashWithdrawRequest',
    inputs: [
      {
        name: 'request',
        type: 'tuple',
        internalType: 'struct WithdrawRequest',
        components: [
          { name: 'timestamp', type: 'uint32', internalType: 'uint32' },
          {
            name: 'tokenAddress',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'orchestrator',
            type: 'address',
            internalType: 'address',
          },
          { name: 'amount', type: 'uint256', internalType: 'uint256' },
          { name: 'nonce', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'initSpokePool',
    inputs: [
      {
        name: 'spokePool',
        type: 'address',
        internalType: 'contract ISpokePool',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'isDepositIdValid',
    inputs: [
      { name: 'account', type: 'address', internalType: 'address' },
      { name: 'depositId', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isInitialized',
    inputs: [
      { name: 'smartAccount', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isModuleType',
    inputs: [{ name: 'typeID', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'isUnlockNonceValid',
    inputs: [
      { name: 'account', type: 'address', internalType: 'address' },
      { name: 'nonce', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'onInstall',
    inputs: [{ name: '', type: 'bytes', internalType: 'bytes' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'onUninstall',
    inputs: [{ name: '', type: 'bytes', internalType: 'bytes' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'registerApprovalSpend',
    inputs: [
      {
        name: 'approvalSpend',
        type: 'tuple',
        internalType: 'struct ApprovalSpend',
        components: [
          { name: 'account', type: 'address', internalType: 'address' },
          { name: 'token', type: 'address', internalType: 'address' },
          { name: 'amount', type: 'uint256', internalType: 'uint256' },
        ],
      },
      {
        name: 'orchestratorSignature',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setOmniLock',
    inputs: [
      {
        name: 'omniLock',
        type: 'tuple',
        internalType: 'struct OmniLock',
        components: [
          { name: 'account', type: 'address', internalType: 'address' },
          { name: 'enabled', type: 'bool', internalType: 'bool' },
        ],
      },
      {
        name: 'orchestratorSignature',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'unlockFundsForAccount',
    inputs: [
      {
        name: 'orchestratorSignature',
        type: 'bytes',
        internalType: 'bytes',
      },
      {
        name: 'request',
        type: 'tuple',
        internalType: 'struct WithdrawRequest',
        components: [
          { name: 'timestamp', type: 'uint32', internalType: 'uint32' },
          {
            name: 'tokenAddress',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'orchestrator',
            type: 'address',
            internalType: 'address',
          },
          { name: 'amount', type: 'uint256', internalType: 'uint256' },
          { name: 'nonce', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'unlockFundsForAccount',
    inputs: [
      { name: 'account', type: 'address', internalType: 'address' },
      { name: 'userSignature', type: 'bytes', internalType: 'bytes' },
      {
        name: 'orchestratorSignature',
        type: 'bytes',
        internalType: 'bytes',
      },
      {
        name: 'request',
        type: 'tuple',
        internalType: 'struct WithdrawRequest',
        components: [
          { name: 'timestamp', type: 'uint32', internalType: 'uint32' },
          {
            name: 'tokenAddress',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'orchestrator',
            type: 'address',
            internalType: 'address',
          },
          { name: 'amount', type: 'uint256', internalType: 'uint256' },
          { name: 'nonce', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'version',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'HandledDeposit',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'recipient',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'depositId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Initialized',
    inputs: [
      {
        name: 'version',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AlreadyInitialized',
    inputs: [
      { name: 'smartAccount', type: 'address', internalType: 'address' },
    ],
  },
  {
    type: 'error',
    name: 'AssetLocked',
    inputs: [
      { name: 'asset', type: 'address', internalType: 'address' },
      { name: 'lockedAmount', type: 'uint256', internalType: 'uint256' },
    ],
  },
  { type: 'error', name: 'FeeExceedsAmount', inputs: [] },
  { type: 'error', name: 'InvalidAccount', inputs: [] },
  { type: 'error', name: 'InvalidAcrossPayload', inputs: [] },
  {
    type: 'error',
    name: 'InvalidAcrossTransferHash',
    inputs: [{ name: 'index', type: 'uint256', internalType: 'uint256' }],
  },
  { type: 'error', name: 'InvalidAmountReceived', inputs: [] },
  { type: 'error', name: 'InvalidCallback', inputs: [] },
  { type: 'error', name: 'InvalidChainId', inputs: [] },
  { type: 'error', name: 'InvalidChainId', inputs: [] },
  { type: 'error', name: 'InvalidDepositId', inputs: [] },
  { type: 'error', name: 'InvalidInitialization', inputs: [] },
  { type: 'error', name: 'InvalidNonce', inputs: [] },
  { type: 'error', name: 'InvalidOrchestrator', inputs: [] },
  { type: 'error', name: 'InvalidOrchestratorSignature', inputs: [] },
  { type: 'error', name: 'InvalidOrderTarget', inputs: [] },
  { type: 'error', name: 'InvalidOriginAccount', inputs: [] },
  { type: 'error', name: 'InvalidOriginExecutor', inputs: [] },
  { type: 'error', name: 'InvalidSpokePool', inputs: [] },
  { type: 'error', name: 'InvalidTokenReceived', inputs: [] },
  { type: 'error', name: 'InvalidUserSignature', inputs: [] },
  {
    type: 'error',
    name: 'ModuleNotInitializedForAccount',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'NotInitialized',
    inputs: [
      { name: 'smartAccount', type: 'address', internalType: 'address' },
    ],
  },
  { type: 'error', name: 'NotInitializing', inputs: [] },
  { type: 'error', name: 'UserIntentExpired', inputs: [] },
  { type: 'error', name: 'UserOpFailed', inputs: [] },
] as const
