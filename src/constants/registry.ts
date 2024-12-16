import { Address } from 'viem'

import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  optimism,
  optimismSepolia,
  sepolia,
} from 'viem/chains'
import { OrchestratorChainConfig, TokenConfig } from '../types'

require('dotenv').config()

export const NATIVE_SENTINEL_ADDRESS: Address =
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

const hook: Address = '0xF7913a68dD7bFF74f0828Ac9d879C6195B370EB8'
const originModule: Address = '0xD3C6B5539E0d70F58160Cd023DB16853847Ec61E'
const targetModule: Address = '0x3cEb8931374cB8F2e300325Af27F44312719B4BB'
const spokepool: Address = '0x7C941271191E0c9A01E360BAE660D21568fc6ca0'
const weth: Address = '0x47D41c334497f06ab42e60C4036c506D924DDc9c'

export const registry: Record<number, OrchestratorChainConfig> = {
  8453: {
    // Base Mainnet
    rpcUrl: `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    viemChain: base,
    spokepool: spokepool,
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
    weth: weth,
    supportedTokens: [
      {
        symbol: 'ETH',
        address: NATIVE_SENTINEL_ADDRESS,
      },
      {
        symbol: 'USDC',
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      },
      {
        symbol: 'WETH',
        address: weth,
      },
    ],
  },
  42161: {
    // Arbitrum Mainnet
    rpcUrl: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    viemChain: arbitrum,
    spokepool: spokepool,
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
    weth: weth,
    supportedTokens: [
      {
        symbol: 'ETH',
        address: NATIVE_SENTINEL_ADDRESS,
      },
      {
        symbol: 'USDC',
        address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      },
      {
        symbol: 'WETH',
        address: weth,
      },
    ],
  },
  10: {
    // Optimism Mainnet
    rpcUrl: `https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    viemChain: optimism,
    spokepool: spokepool,
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
    weth: weth,
    supportedTokens: [
      {
        symbol: 'ETH',
        address: NATIVE_SENTINEL_ADDRESS,
      },
      {
        symbol: 'USDC',
        address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
      },
      {
        symbol: 'WETH',
        address: weth,
      },
    ],
  },
  11155111: {
    // Ethereum Sepolia
    rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    viemChain: sepolia,
    spokepool: spokepool,
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
    weth: weth,
    supportedTokens: [
      {
        symbol: 'ETH',
        address: NATIVE_SENTINEL_ADDRESS,
      },
      {
        symbol: 'USDC',
        address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      },
      {
        symbol: 'WETH',
        address: weth,
      },
    ],
  },
  84532: {
    // Base Sepolia
    rpcUrl: `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    viemChain: baseSepolia,
    spokepool: spokepool,
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
    weth: weth,
    supportedTokens: [
      {
        symbol: 'ETH',
        address: NATIVE_SENTINEL_ADDRESS,
      },
      {
        symbol: 'USDC',
        address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
      },
      {
        symbol: 'WETH',
        address: weth,
      },
    ],
  },
  421614: {
    // Arbitrum Sepolia
    rpcUrl: `https://arb-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    viemChain: arbitrumSepolia,
    spokepool: spokepool,
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
    weth: weth,
    supportedTokens: [
      {
        symbol: 'ETH',
        address: NATIVE_SENTINEL_ADDRESS,
      },
      {
        symbol: 'USDC',
        address: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
      },
      {
        symbol: 'WETH',
        address: weth,
      },
    ],
  },
  11155420: {
    rpcUrl: `https://opt-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    viemChain: optimismSepolia,
    spokepool: spokepool,
    hook: hook,
    originModule: originModule,
    targetModule: targetModule,
    weth: weth,
    supportedTokens: [
      {
        symbol: 'ETH',
        address: NATIVE_SENTINEL_ADDRESS,
      },
      {
        symbol: 'USDC',
        address: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
      },
      {
        symbol: 'WETH',
        address: weth,
      },
    ],
  },
}

export function getTokenSymbol(tokenAddress: Address, chainId: number): string {
  if (!isSupportedChainId(chainId)) {
    throw new Error(`Chain ${chainId} not supported`)
  }

  const token = registry[chainId].supportedTokens.find(
    (token) => token.address === tokenAddress,
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
