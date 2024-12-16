import { Address, Hex } from 'viem'
import {
  BundleIdStatus,
  Execution,
  MetaIntent,
  SignedIntent,
  SignedOrderBundle,
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

  async createUserAccount(
    accountAddress: Address,
    chainIds: number[],
  ): Promise<string> {
    try {
      const response = await axios.post(
        `${this.serverUrl}/users`,
        {
          accountAddress: accountAddress,
          chainIds: chainIds,
        },
        {
          headers: {
            'x-api-key': this.apiKey,
          },
        },
      )
      return response.data.userId
    } catch (error) {
      console.error(error)
    }

    throw new Error('Failed to create user account')
  }

  async getUserId(
    accountAddress: Address,
    chainId?: number,
  ): Promise<{ userId: string; chainId: number }[]> {
    try {
      const response = await axios.get(`${this.serverUrl}/users`, {
        headers: {
          'x-api-key': this.apiKey,
        },
        params: {
          accountAddress: accountAddress,
          chainId: chainId ? chainId : undefined,
        },
      })
      return response.data
    } catch (error) {
      console.log(error)
    }
    throw new Error('Failed to get user')
  }

  async getPortfolio(userId: string) {
    try {
      const response = await axios.get(
        `${this.serverUrl}/users/${userId}/portfolio`,
        {
          headers: {
            'x-api-key': this.apiKey,
          },
        },
      )
      return response.data
    } catch (error) {
      console.log(error)
    }
    throw new Error('Failed to get portfolio')
  }

  async getOrderPath(
    intent: MetaIntent,
    userId: string,
  ): Promise<{ orderBundle: SignedIntent; injectedExecutions: Execution[] }> {
    try {
      const response = await axios.post(
        `${this.serverUrl}/users/${userId}/bundles/path`,
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
    } catch (error) {
      if (error instanceof Error) {
        console.log(error)
      }
    }
    throw new Error('Failed to get order path')
  }

  async postSignedOrderBundle(
    signedOrderBundle: SignedOrderBundle,
    userId: string,
  ): Promise<string> {
    try {
      const response = await axios.post(
        `${this.serverUrl}/users/${userId}/bundles`,
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
      if (error instanceof Error) {
        console.log(error)
      }
    }

    throw new Error('Failed to post order bundle')
  }

  async getBundleStatus(
    userId: string,
    bundleId: string,
  ): Promise<BundleIdStatus> {
    try {
      const response = await axios.get(
        `${this.serverUrl}/users/${userId}/bundles/${bundleId}`,
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
      console.log(error)
    }
    throw new Error('Failed to get bundle status')
  }

  async getSolverClaimPayload(bundleId: string) {
    try {
      const response = await axios.put(
        `${this.serverUrl}/solvers/${bundleId}`,
        {},
        {
          headers: {
            'x-api-key': this.apiKey,
          },
        },
      )
      return response.data
    } catch (error) {
      console.log(error)
    }
    throw new Error('Failed to get solver claim payload')
  }
}
