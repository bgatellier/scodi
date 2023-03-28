import type { JsonValue } from "type-fest"
import {
  ConfigInputError,
  ListenersInputError,
  ModuleListenerInterface,
  ThresholdInputError,
} from "../../index.js"

/**
 * Validate that the analysis options are correct.
 * Throws InputError if not.
 *
 * @throws {ConfigInputError}
 * @throws {ThresholdError}
 * @throws {ListenersError}
 */
export function validateAnalysisInput(
  configFile: JsonValue | undefined,
  configInline: JsonValue | undefined,
  threshold: number | undefined,
  listenerModulesIds: ModuleListenerInterface["id"][],
  exceptListenersIds: string[] | undefined,
  onlyListenersIds: string[] | undefined
): void {
  validateConfig(configFile, configInline)
  validateThreshold(threshold)
  validateListenerModules(listenerModulesIds, exceptListenersIds, onlyListenersIds)
}

function validateListenersInput(
  listenerModulesIds: ModuleListenerInterface["id"][],
  optionValues: string[]
): boolean {
  return optionValues.every((optionValue) => listenerModulesIds.includes(optionValue))
}

/**
 * @throws {ConfigInputError}
 */
function validateConfig(configFile: JsonValue | undefined, configInline: JsonValue | undefined): void {
  if (configFile === undefined && configInline === undefined) {
    throw new ConfigInputError("You must provide a configuration.")
  } else if (configFile !== undefined && configInline !== undefined) {
    throw new ConfigInputError("You must provide only one configuration.")
  } else if (configFile !== undefined) {
    if (typeof configFile !== "object" || configFile === null || Array.isArray(configFile)) {
      throw new ConfigInputError("The configuration must be a JSON object.")
    }
  } else {
    if (typeof configInline !== "object" || configInline === null || Array.isArray(configInline)) {
      throw new ConfigInputError("The configuration must be a JSON object.")
    }
  }
}

/**
 * @throws {ThresholdInputError}
 */
function validateThreshold(threshold: number | undefined): void {
  if (threshold !== undefined && (isNaN(threshold) || threshold < 0 || threshold > 100)) {
    throw new ThresholdInputError("The threshold must be a number between 0 and 100.")
  }
}

/**
 * Validate the listeners options
 *
 * @param listenerModulesIds IDs of the listener modules loaded
 * @param exceptListeners IDs of the listener modules unwanted amongst listenerModulesIds
 * @param onlyListeners IDs of the listener modules to keep amongst listenerModulesIds
 *
 * @throws {ListenersError}
 */
function validateListenerModules(
  listenerModulesIds: ModuleListenerInterface["id"][],
  exceptListenersIds: string[] | undefined,
  onlyListenersIds: string[] | undefined
): void {
  if (exceptListenersIds !== undefined) {
    if (Array.isArray(exceptListenersIds)) {
      const isListenerOptionValid = validateListenersInput(listenerModulesIds, exceptListenersIds)

      if (!isListenerOptionValid) {
        throw new ListenersInputError(`Possible values: ${listenerModulesIds.join(", ")}.`)
      }
    } else {
      throw new ListenersInputError(
        `Must be an array with some of these values: ${listenerModulesIds.join(", ")}.`
      )
    }
  } else if (onlyListenersIds !== undefined) {
    if (Array.isArray(onlyListenersIds)) {
      const isListenerOptionValid = validateListenersInput(listenerModulesIds, onlyListenersIds)

      if (!isListenerOptionValid) {
        throw new ListenersInputError(`Possible values: ${listenerModulesIds.join(", ")}.`)
      }
    } else {
      throw new ListenersInputError(
        `Must be an array with some of these values: ${listenerModulesIds.join(", ")}.`
      )
    }
  }
}