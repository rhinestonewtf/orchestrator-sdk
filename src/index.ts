import { ORCHESTRATOR_PUBLIC_KEY, ORCHESTRATOR_URL } from './constants'
import { Orchestrator } from './orchestrator'

export * from './orchestrator'
export * from './types'
export * from './constants'
export * from './utils'

export { Orchestrator }
export function getOrchestrator(apiKey: string): Orchestrator {
  return new Orchestrator(ORCHESTRATOR_URL, apiKey)
}
