import { Address, concat } from 'viem'
import {
  GetBundleResult,
  MetaIntent,
  SignedMultiChainCompact,
  UserTokenBalance,
} from './types'
import { convertBigIntFields } from './utils'
import axios from 'axios'

// TODO: Add strict typing to the return values of the endpoints.

export class Orchestrator {
  private serverUrl: string
  private apiKey: string

  constructor(serverUrl: string, apiKey: string) {
    this.serverUrl = serverUrl
    this.apiKey = apiKey
  }

  async getPortfolio(
    userAddress: Address,
    filter?: {
      chainIds?: number[]
      tokens?: {
        [chainId: number]: Address[]
      }
    },
  ): Promise<UserTokenBalance[]> {
    try {
      const response = await axios.get(
        `${this.serverUrl}/accounts/${userAddress}/portfolio`,
        {
          params: {
            chainIds: filter?.chainIds,
            tokens: filter?.tokens
              ? Object.entries(filter.tokens)
                  .map(([chainId, tokens]) =>
                    tokens.map((token) => `${chainId}:${token}`),
                  )
                  .reduce(concat, [])
              : undefined,
          },
          headers: {
            'x-api-key': this.apiKey,
          },
        },
      )
      return response.data.portfolio
    } catch (error) {
      this.parseError(error)
      throw new Error('Failed to get portfolio')
    }
  }

  async getOrderPath(intent: MetaIntent, userAddress: Address): Promise<any> {
    //Promise<{ orderBundle: SignedIntent; injectedExecutions: Execution[] }> {
    try {
      const response = await axios.post(
        `${this.serverUrl}/accounts/${userAddress}/bundles/path`,
        {
          ...convertBigIntFields(intent),
        },
        {
          headers: {
            'x-api-key': this.apiKey,
          },
        },
      )
      return {
        orderBundle: response.data.orderBundle,
        injectedExecutions: response.data.injectedExecutions,
      }
    } catch (error: any) {
      this.parseError(error)
      throw new Error(error)
    }
  }

  async postSignedOrderBundle(
    signedOrderBundle: SignedMultiChainCompact,
  ): Promise<string> {
    try {
      const response = await axios.post(
        `${this.serverUrl}/bundles`,
        {
          signedOrderBundle: signedOrderBundle,
        },
        {
          headers: {
            'x-api-key': this.apiKey,
          },
        },
      )
      return response.data.bundleId
    } catch (error) {
      this.parseError(error)
      throw new Error('Failed to post order bundle')
    }
  }

  async getBundleStatus(bundleId: string): Promise<GetBundleResult> {
    try {
      const response = await axios.get(
        `${this.serverUrl}/bundles/${bundleId}`,
        {
          headers: {
            'x-api-key': this.apiKey,
          },
        },
      )

      response.data.orderStatus = response.data.orderStatus.map(
        (order: { depositId: string; status: string }) => {
          return {
            depositId: BigInt(order.depositId),
            status: order.status,
          }
        },
      )

      return response.data
    } catch (error) {
      this.parseError(error)
      throw new Error('Failed to get bundle status')
    }
  }

  private parseError(error: any) {
    if (error.response) {
      let errorType: string | undefined
      if (error.response.status) {
        switch (error.response.status) {
          case 400:
            errorType = 'Bad Request'
            break
          case 401:
            errorType = 'Unauthorized'
            break
          case 403:
            errorType = 'Forbidden'
            break
          case 404:
            errorType = 'Not Found'
            break
          case 409:
            errorType = 'Conflict'
            break
          case 422:
            errorType = 'Unprocessable Entity'
            break
          case 500:
            errorType = 'Internal Server Error'
            break
          default:
            errorType = 'Unknown'
        }
      }
      if (error.response.data) {
        const { errors } = error.response.data
        for (const err of errors) {
          let errorMessage = `Rhinestone Error: ${err.message}`
          if (errorType) {
            errorMessage += ` (${errorType})`
          }
          console.error(errorMessage)
          if (err.context) {
            console.error(
              `Context: ${JSON.stringify(err.context, undefined, 4)}`,
            )
          }
        }
      } else {
        console.error(error)
      }
    }
  }
}
