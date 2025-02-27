import { Address, concat } from 'viem'
import {
  BundleResult,
  MetaIntent,
  MultiChainCompact,
  PostOrderBundleResult,
  SignedMultiChainCompact,
  UserTokenBalance,
  Execution,
} from './types'
import type { UserOperation } from 'viem/account-abstraction'
import { convertBigIntFields } from './utils'
import { parseCompactResponse } from './utils/bigIntUtils'
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
      // TODO: Parse bigint fields
      return response.data.portfolio.map((balance: any) => {
        return {
          ...balance,
          balance: BigInt(balance.balance),
          tokenChainBalance: balance.tokenChainBalance.map(
            (chainBalance: any) => {
              return {
                ...chainBalance,
                balance: BigInt(chainBalance.balance),
              }
            },
          ),
        }
      })
    } catch (error) {
      this.parseError(error)
      throw new Error('Failed to get portfolio')
    }
  }

  async getOrderPath(
    intent: MetaIntent,
    userAddress: Address,
  ): Promise<
    {
      orderBundle: MultiChainCompact
      injectedExecutions: Execution[]
    }[]
  > {
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

      return response.data.orderBundles.map((orderPath: any) => {
        return {
          orderBundle: parseCompactResponse(orderPath.orderBundle),
          injectedExecutions: orderPath.injectedExecutions.map((exec: any) => {
            return {
              ...exec,
              value: BigInt(exec.value),
            }
          }),
        }
      })
    } catch (error: any) {
      this.parseError(error)
      throw new Error(error)
    }
  }

  async postSignedOrderBundle(
    signedOrderBundles: {
      signedOrderBundle: SignedMultiChainCompact
      userOp?: UserOperation
    }[],
  ): Promise<PostOrderBundleResult> {
    try {
      const bundles = signedOrderBundles.map(
        (signedOrderBundle: {
          signedOrderBundle: SignedMultiChainCompact
          userOp?: UserOperation
        }) => {
          return {
            signedOrderBundle: convertBigIntFields(
              signedOrderBundle.signedOrderBundle,
            ),
            userOp: signedOrderBundle.userOp
              ? convertBigIntFields(signedOrderBundle.userOp)
              : undefined,
          }
        },
      )
      const response = await axios.post(
        `${this.serverUrl}/bundles`,
        {
          bundles,
        },
        {
          headers: {
            'x-api-key': this.apiKey,
          },
        },
      )

      return response.data.bundleResults.map((bundleResult: any) => {
        return {
          ...bundleResult,
          bundleId: BigInt(bundleResult.bundleId),
        }
      })
    } catch (error) {
      this.parseError(error)
      throw new Error('Failed to post order bundle')
    }
  }

  async getBundleStatus(bundleId: bigint): Promise<BundleResult> {
    try {
      const response = await axios.get(
        `${this.serverUrl}/bundles/${bundleId.toString()}`,
        {
          headers: {
            'x-api-key': this.apiKey,
          },
        },
      )

      response.data.claims = response.data.claims.map((claim: any) => {
        return {
          ...claim,
          depositId: BigInt(claim.depositId),
        }
      })

      return response.data
    } catch (error) {
      this.parseError(error)
      throw new Error('Failed to get bundle status')
    }
  }

  async getPendingBundles(
    count: number = 20,
    offset: number = 0,
  ): Promise<{ pendingBundles: MultiChainCompact[]; nextOffset?: number }> {
    try {
      const response = await axios.get(`${this.serverUrl}/bundles/events`, {
        params: {
          count,
          offset,
        },
        headers: {
          'x-api-key': this.apiKey,
        },
      })
      const { events: pendingBundles, nextOffset } = response.data

      return {
        pendingBundles: pendingBundles.map(parseCompactResponse),
        nextOffset,
      }
    } catch (error) {
      this.parseError(error)
      throw new Error('Failed to get pending bundles')
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
        const { errors, traceId } = error.response.data
        for (const err of errors) {
          let errorMessage = `Rhinestone Error: ${err.message}`
          if (errorType) {
            errorMessage += ` (${errorType})`
          }
          if (traceId) {
            errorMessage += ` [Trace ID: ${traceId}]`
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
