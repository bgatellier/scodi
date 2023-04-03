import { Option } from "commander"
import type { JsonValue } from "type-fest"
import { readFile } from "../../filesystem/fs.js"
import { snakeCaseToCamelCase } from "../../text/case.js"

export type AnalysisOptions = { config: JsonValue } & Partial<{
  threshold: number
  exceptListeners: string[] // array of strings because of the .argParser() on the Option
  onlyListeners: string[] // array of strings because of the .argParser() on the Option
}>

// the keys are used to create the options names:
// - options long names: keys names
// - options short names: first letter of the keys names
const ANALYSIS_OPTIONS: { [key in keyof AnalysisOptions]-?: string } = {
  config: "config",
  threshold: "threshold",
  exceptListeners: "except-listeners",
  onlyListeners: "only-listeners",
}

function parseConfig(config: string): JsonValue {
  return JSON.parse(config) as JsonValue
}

export function createConfigOption(): Option {
  return new Option(
    `-${ANALYSIS_OPTIONS.config[0]}, --${ANALYSIS_OPTIONS.config} <${ANALYSIS_OPTIONS.config}>", "Path to the JSON configuration file`
  )
    .makeOptionMandatory()
    .argParser((config) => {
      try {
        const configStringified = readFile(config)

        return parseConfig(configStringified)
      } catch (error) {
        // TODO: catch ErrnoException & JSON.parse config
        console.error("ya un soucis coco!")
        throw error
      }
    })
}

export function createThresholdOption(): Option {
  return new Option(
    `-${ANALYSIS_OPTIONS.threshold[0]}, --${ANALYSIS_OPTIONS.threshold} <${ANALYSIS_OPTIONS.threshold}>`,
    "A threshold between 0 and 100 that you want to reach with the analysis"
  ).argParser((value) => Number(value))
}

export function createExceptListenersOption(): Option {
  return new Option(
    `-le, --${ANALYSIS_OPTIONS.exceptListeners} <${snakeCaseToCamelCase(ANALYSIS_OPTIONS.exceptListeners)}>`,
    "A comma-separated list of listener modules that will not be triggered after the analysis is done"
  )
    .conflicts(snakeCaseToCamelCase(ANALYSIS_OPTIONS.onlyListeners))
    .argParser((value) => value.split(","))
}

export function createOnlyListenersOption(): Option {
  return new Option(
    `-lo, --${ANALYSIS_OPTIONS.onlyListeners} <${snakeCaseToCamelCase(ANALYSIS_OPTIONS.onlyListeners)}>`,
    "A comma-separated list of listener modules that will be triggered after the analysis is done"
  )
    .conflicts(snakeCaseToCamelCase(ANALYSIS_OPTIONS.exceptListeners))
    .argParser((value) => value.split(","))
}
