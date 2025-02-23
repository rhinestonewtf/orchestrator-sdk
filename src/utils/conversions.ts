import { Execution, XchainExec } from "../types"

export function getExecution(exec: XchainExec): Execution {
  return {
    target: exec.to,
    value: exec.value,
    callData: exec.data,
  }
}

export function getExecutions(execs: readonly XchainExec[]): Execution[] {
  return execs.map((exec) => getExecution(exec))
}
