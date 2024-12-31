import { ORCHESTRATOR_URL } from './constants'
import { Orchestrator } from './orchestrator'

export * from './orchestrator'
export * from './types'
export * from './constants'
export * from './utils'
export * from './common'

export { Orchestrator }

export function getOrchestrator(
  apiKey: string,
  orchestratorUrl?: string,
): Orchestrator {
  return new Orchestrator(orchestratorUrl ?? ORCHESTRATOR_URL, apiKey)
}
