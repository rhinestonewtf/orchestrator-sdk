import { Address } from 'viem'

import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
  sepolia,
} from 'viem/chains'
import { OrchestratorChainConfig, TokenConfig } from '../types'

export const NATIVE_SENTINEL_ADDRESS: Address =
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

const hook: Address = '0x29BDcBc36e344061393f8AB58D2D6AABaedeAaAE'
const originModule: Address = '0xE1058634834E01038CadbaE8208BFfF81B1Ede51'
const targetModule: Address = '0xA90F831363708B32a3f1502165253E0210cf680d'

export const registry: Record<number, OrchestratorChainConfig> = {
  8453: {
    // Base Mainnet
    rpcUrl: `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    viemChain: base,
    spokepool: '0x20038b572633E45F3aB5b1a46CB85D0D241b80D8',
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
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
  42161: {
    // Arbitrum Mainnet
    rpcUrl: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    viemChain: arbitrum,
    spokepool: '0x35F36B0ebfFe06Dc29e3d11ae8b335d3Af4D014A',
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
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
  10: {
    // Optimism Mainnet
    rpcUrl: `https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    viemChain: optimism,
    spokepool: '0x20038b572633E45F3aB5b1a46CB85D0D241b80D8',
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
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
  137: {
    // Polygon Mainnet
    rpcUrl: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    viemChain: polygon,
    spokepool: '0x096D7c616cF40cf0de667c3Ccc9fc322079f4645',
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
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

  11155111: {
    // Ethereum Sepolia
    rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    viemChain: sepolia,
    spokepool: '0x2171A3C4592d5Ae06E0257728aB4E88E575f4cF3',
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
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
  84532: {
    // Base Sepolia
    rpcUrl: `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    viemChain: baseSepolia,
    spokepool: '0x20038b572633E45F3aB5b1a46CB85D0D241b80D8',
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
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
  421614: {
    // Arbitrum Sepolia
    rpcUrl: `https://arb-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    viemChain: arbitrumSepolia,
    spokepool: '0xAE6B1f4aA87e0F73DADb10B9CA4F8531BfaFAD19',
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
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
  11155420: {
    rpcUrl: `https://opt-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    viemChain: optimismSepolia,
    spokepool: '0x20038b572633E45F3aB5b1a46CB85D0D241b80D8',
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
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
  80002: {
    // Polygon Amoy
    rpcUrl: `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    viemChain: polygonAmoy,
    spokepool: '0x0c6Fd5973bbDDAeaFC2F5f3989BbCD1635850D73',
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
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

  const token = registry[chainId].supportedTokens.find(
    (token) => token.address.toLowerCase() === tokenAddress.toLowerCase(),
  )

  if (!token) {
    throw new Error(`Token ${tokenAddress} not supported on chain ${chainId}`)
  }

  return token.symbol
}

export function getTokenAddress(tokenSymbol: string, chainId: number): Address {
  if (!isSupportedChainId(chainId)) {
    throw new Error(`Chain ${chainId} not supported`)
  }

  const token = registry[chainId].supportedTokens.find(
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

  return registry[chainId].supportedTokens
}

export const getSpokePoolAddress = (chainId: number): Address => {
  if (!isSupportedChainId(chainId)) {
    throw new Error(`Chain ${chainId} not supported`)
  }

  return registry[chainId].spokepool
}

export const getHookAddress = (chainId: number): Address => {
  if (!isSupportedChainId(chainId)) {
    throw new Error(`Chain ${chainId} not supported`)
  }

  return registry[chainId].hook
}

export const getOriginModuleAddress = (chainId: number): Address => {
  if (!isSupportedChainId(chainId)) {
    throw new Error(`Chain ${chainId} not supported`)
  }

  return registry[chainId].originModule
}

export const getTargetModuleAddress = (chainId: number): Address => {
  if (!isSupportedChainId(chainId)) {
    throw new Error(`Chain ${chainId} not supported`)
  }

  return registry[chainId].targetModule
}

export const getChainConfig = (chainId: number): OrchestratorChainConfig => {
  if (!isSupportedChainId(chainId)) {
    throw new Error(`Chain ${chainId} not supported`)
  }

  return registry[chainId]
}
