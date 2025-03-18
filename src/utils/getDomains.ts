import { Address, domainSeparator, TypedDataDomain } from 'viem'

export function getCompactDomain(
  chainId: number,
  verifyingContract: Address,
): TypedDataDomain {
  return {
    name: 'The Compact',
    version: '0',
    chainId: chainId,
    verifyingContract: verifyingContract,
  }
}

export function getRhinestoneSpokepoolDomain(
  chainId: number,
  verifyingContract: Address,
): TypedDataDomain {
  return {
    name: 'RSSpokePool',
    version: '0.1',
    chainId: chainId,
    verifyingContract: verifyingContract,
  }
}

export function getCompactDomainSeparator(
  chainId: number,
  verifyingContract: Address,
) {
  return domainSeparator({
    domain: getCompactDomain(chainId, verifyingContract),
  })
}
