import { Address } from 'viem'
import { SupportedChain, OrchestratorChainConfig, TokenConfig } from '../types'

export const NATIVE_SENTINEL_ADDRESS: Address =
  '0x0000000000000000000000000000000000000000'

const hook: Address = '0x0000000000f6Ed8Be424d673c63eeFF8b9267420'
const originModule: Address = '0x0000000000AFc904aE9860D9c4B96D7c529c58b8'
const targetModule: Address = '0x0000000000E5a37279A001301A837a91b5de1D5E'
const sameChainModule: Address = '0x000000000043ff16d5776c7F0f65Ec485C17Ca04'
const rhinestoneSpokepoolAddress: Address =
  '0x000000000060f6e853447881951574CDd0663530'

export const registry: Record<SupportedChain, OrchestratorChainConfig> = {
  // Base Mainnet
  8453: {
    spokepool: '0x20038b572633E45F3aB5b1a46CB85D0D241b80D8',
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
    sameChainModule: sameChainModule,
    weth: '0x4200000000000000000000000000000000000006',
    supportedTokens: [
      {
        symbol: 'ETH',
        address: NATIVE_SENTINEL_ADDRESS,
        decimals: 18,
      },
      {
        symbol: 'USDC',
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        decimals: 6,
      },
      {
        symbol: 'WETH',
        address: '0x4200000000000000000000000000000000000006',
        decimals: 18,
      },
    ],
  },
  // Arbitrum Mainnet
  42161: {
    spokepool: '0x35F36B0ebfFe06Dc29e3d11ae8b335d3Af4D014A',
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
    sameChainModule: sameChainModule,
    weth: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    supportedTokens: [
      {
        symbol: 'ETH',
        address: NATIVE_SENTINEL_ADDRESS,
        decimals: 18,
      },
      {
        symbol: 'USDC',
        address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        decimals: 6,
      },
      {
        symbol: 'WETH',
        address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        decimals: 18,
      },
    ],
  },
  // Optimism Mainnet
  10: {
    spokepool: '0x20038b572633E45F3aB5b1a46CB85D0D241b80D8',
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
    sameChainModule: sameChainModule,
    weth: '0x4200000000000000000000000000000000000006',
    supportedTokens: [
      {
        symbol: 'ETH',
        address: NATIVE_SENTINEL_ADDRESS,
        decimals: 18,
      },
      {
        symbol: 'USDC',
        address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
        decimals: 6,
      },
      {
        symbol: 'WETH',
        address: '0x4200000000000000000000000000000000000006',
        decimals: 18,
      },
    ],
  },
  // Polygon Mainnet
  137: {
    spokepool: '0x096D7c616cF40cf0de667c3Ccc9fc322079f4645',
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
    sameChainModule: sameChainModule,
    weth: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    supportedTokens: [
      {
        symbol: 'USDC',
        address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
        decimals: 6,
      },
      {
        symbol: 'WETH',
        address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        decimals: 18,
      },
    ],
  },
  // Ethereum
  1: {
    spokepool: '0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5',
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
    sameChainModule: sameChainModule,
    weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    supportedTokens: [
      {
        symbol: 'ETH',
        address: NATIVE_SENTINEL_ADDRESS,
        decimals: 18,
      },
      {
        symbol: 'USDC',
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        decimals: 6,
      },
      {
        symbol: 'WETH',
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        decimals: 18,
      },
    ],
  },
  // Ethereum Sepolia
  11155111: {
    spokepool: '0x2171A3C4592d5Ae06E0257728aB4E88E575f4cF3',
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
    sameChainModule: sameChainModule,
    weth: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    supportedTokens: [
      {
        symbol: 'ETH',
        address: NATIVE_SENTINEL_ADDRESS,
        decimals: 18,
      },
      {
        symbol: 'USDC',
        address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        decimals: 6,
      },
      {
        symbol: 'WETH',
        address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
        decimals: 18,
      },
    ],
  },
  // Base Sepolia
  84532: {
    spokepool: '0x20038b572633E45F3aB5b1a46CB85D0D241b80D8',
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
    sameChainModule: sameChainModule,
    weth: '0x4200000000000000000000000000000000000006',
    supportedTokens: [
      {
        symbol: 'ETH',
        address: NATIVE_SENTINEL_ADDRESS,
        decimals: 18,
      },
      {
        symbol: 'USDC',
        address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
        decimals: 6,
      },
      {
        symbol: 'WETH',
        address: '0x4200000000000000000000000000000000000006',
        decimals: 18,
      },
    ],
  },
  // Arbitrum Sepolia
  421614: {
    spokepool: '0xAE6B1f4aA87e0F73DADb10B9CA4F8531BfaFAD19',
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
    sameChainModule: sameChainModule,
    weth: '0x980B62Da83eFf3D4576C647993b0c1D7faf17c73',
    supportedTokens: [
      {
        symbol: 'ETH',
        address: NATIVE_SENTINEL_ADDRESS,
        decimals: 18,
      },
      {
        symbol: 'USDC',
        address: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
        decimals: 6,
      },
      {
        symbol: 'WETH',
        address: '0x980B62Da83eFf3D4576C647993b0c1D7faf17c73',
        decimals: 18,
      },
    ],
  },
  // Optimism Sepolia
  11155420: {
    spokepool: '0x20038b572633E45F3aB5b1a46CB85D0D241b80D8',
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
    sameChainModule: sameChainModule,
    weth: '0x4200000000000000000000000000000000000006',
    supportedTokens: [
      {
        symbol: 'ETH',
        address: NATIVE_SENTINEL_ADDRESS,
        decimals: 18,
      },
      {
        symbol: 'USDC',
        address: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
        decimals: 6,
      },
      {
        symbol: 'WETH',
        address: '0x4200000000000000000000000000000000000006',
        decimals: 18,
      },
    ],
  },
  // Polygon Amoy
  80002: {
    spokepool: '0x0c6Fd5973bbDDAeaFC2F5f3989BbCD1635850D73',
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
    sameChainModule: sameChainModule,
    weth: '0x52eF3d68BaB452a294342DC3e5f464d7f610f72E',
    supportedTokens: [
      {
        symbol: 'USDC',
        address: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
        decimals: 6,
      },
      {
        symbol: 'WETH',
        address: '0x52eF3d68BaB452a294342DC3e5f464d7f610f72E',
        decimals: 18,
      },
    ],
  },
}

export function getTokenSymbol(tokenAddress: Address, chainId: number): string {
  if (!isSupportedChainId(chainId)) {
    throw new Error(`Chain ${chainId} not supported`)
  }

  const token = registry[chainId as SupportedChain].supportedTokens.find(
    (token) => token.address.toLowerCase() === tokenAddress.toLowerCase(),
  )

  if (!token) {
    throw new Error(`Token ${tokenAddress} not supported on chain ${chainId}`)
  }

  return token.symbol
}

export function isTokenSupported(
  tokenSymbol: string,
  chainId: number,
): boolean {
  if (!isSupportedChainId(chainId)) {
    throw new Error(`Chain ${chainId} not supported`)
  }

  return registry[chainId as SupportedChain].supportedTokens.some(
    (token: TokenConfig) => token.symbol === tokenSymbol,
  )
}

export function getTokenAddress(tokenSymbol: string, chainId: number): Address {
  if (!isSupportedChainId(chainId)) {
    throw new Error(`Chain ${chainId} not supported`)
  }

  const token = registry[chainId as SupportedChain].supportedTokens.find(
    (token) => token.symbol === tokenSymbol,
  )

  if (!token) {
    throw new Error(`Token ${tokenSymbol} not supported on chain ${chainId}`)
  }

  return token.address
}

export function getSupportedChainIds(): number[] {
  return [...Object.keys(registry).map((chainId) => parseInt(chainId))]
}

export function isSupportedChainId(chainId: number): boolean {
  return getSupportedChainIds().includes(chainId)
}

export function getSupportedTokens(chainId: number): TokenConfig[] {
  if (!isSupportedChainId(chainId)) {
    throw new Error(`Chain ${chainId} not supported`)
  }

  return registry[chainId as SupportedChain].supportedTokens
}

export const getSpokePoolAddress = (chainId: number): Address => {
  if (!isSupportedChainId(chainId)) {
    throw new Error(`Chain ${chainId} not supported`)
  }

  return registry[chainId as SupportedChain].spokepool
}

export const getRhinestoneSpokePoolAddress = (chainId: number): Address => {
  if (!isSupportedChainId(chainId)) {
    throw new Error(`Chain ${chainId} not supported`)
  }

  return rhinestoneSpokepoolAddress
}

export const getHookAddress = (chainId: number): Address => {
  if (!isSupportedChainId(chainId)) {
    throw new Error(`Chain ${chainId} not supported`)
  }

  return registry[chainId as SupportedChain].hook
}

export const getOriginModuleAddress = (chainId: number): Address => {
  if (!isSupportedChainId(chainId)) {
    throw new Error(`Chain ${chainId} not supported`)
  }

  return registry[chainId as SupportedChain].originModule
}

export const getTargetModuleAddress = (chainId: number): Address => {
  if (!isSupportedChainId(chainId)) {
    throw new Error(`Chain ${chainId} not supported`)
  }

  return registry[chainId as SupportedChain].targetModule
}

export const getSameChainModuleAddress = (chainId: number): Address => {
  if (!isSupportedChainId(chainId)) {
    throw new Error(`Chain ${chainId} not supported`)
  }

  return registry[chainId as SupportedChain].sameChainModule
}

export const getChainConfig = (chainId: number): OrchestratorChainConfig => {
  if (!isSupportedChainId(chainId)) {
    throw new Error(`Chain ${chainId} not supported`)
  }

  return registry[chainId as SupportedChain]
}
