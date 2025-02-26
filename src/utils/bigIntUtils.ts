export function convertBigIntFields(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (typeof obj === 'bigint') {
    return obj.toString()
  }

  if (Array.isArray(obj)) {
    return obj.map(convertBigIntFields)
  }

  if (typeof obj === 'object') {
    const result: any = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = convertBigIntFields(obj[key])
      }
    }
    return result
  }

  return obj
}

// TODO: Do not export from utils
export function parseResponse<MultiChainCompact>(
  response: any,
): MultiChainCompact {
  return {
    ...response,
    nonce: BigInt(response.nonce),
    expires: BigInt(response.expires),
    segments: response.segments.map((segment: any) => {
      return {
        ...segment,
        chainId: BigInt(segment.chainId),
        idsAndAmounts: segment.idsAndAmounts.map((idsAndAmount: any) => {
          return [BigInt(idsAndAmount[0]), BigInt(idsAndAmount[1])]
        }),
        witness: {
          ...segment.witness,
          depositId: BigInt(segment.witness.depositId),
          targetChain: BigInt(segment.witness.targetChain),
          fillDeadline: BigInt(segment.witness.fillDeadline),
          execs: segment.witness.execs.map((exec: any) => {
            return {
              ...exec,
              value: BigInt(exec.value),
            }
          }),
          maxFeeBps: BigInt(segment.witness.maxFeeBps),
        },
      }
    }),
  }
}
