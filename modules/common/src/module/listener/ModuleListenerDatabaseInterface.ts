import type { ModuleListenerInterface } from "./ModuleListenerInterface.js"

/**
 * Define a database Listener module.
 */
export interface ModuleListenerDatabaseInterface extends ModuleListenerInterface {
  hasPendingMigrations(): Promise<boolean>
  runPendingMigrations(): Promise<void>
}

/**
 * Constructor interface signature
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html#difference-between-the-static-and-instance-sides-of-classes}
 */
export type ModuleListenerDatabase = new () => ModuleListenerDatabaseInterface

/**
 * Checks if a module is a Listener one.
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates | User-Defined Type Guards}
 */
export function isModuleListenerDatabase(
  module: ModuleListenerInterface
): module is ModuleListenerDatabaseInterface {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (
    (module as ModuleListenerDatabaseInterface).hasPendingMigrations !== undefined &&
    (module as ModuleListenerDatabaseInterface).runPendingMigrations !== undefined
  )
}
