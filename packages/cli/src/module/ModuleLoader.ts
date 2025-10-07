import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { env } from "node:process";
import {
	logger,
	type Module,
	type ModuleIndex,
	type ModuleMetadata,
} from "@scodi/common";
import Ajv, { type AnySchema, type ErrorObject } from "ajv";
import AjvErrors from "ajv-errors";
import addFormats from "ajv-formats";
import dotenv from "dotenv";
import type { PackageJson } from "type-fest";
import { EnvironmentError } from "../error/EnvironmentError.js";
import type { PackageJsonModule } from "./PackageJson.js";

type ModulesMetadata = [
	Map<string, PackageJsonModule>,
	Map<string, PackageJsonModule>,
	Map<string, PackageJsonModule>,
];

const errors: ErrorObject[] = [];
const ajv = new Ajv.default({ allErrors: true });
addFormats.default(ajv);
AjvErrors.default(ajv /*, {singleError: true} */);

const PACKAGE_PREFIX = "@scodi/";
const DOTENV_DEFAULT_VALUES_NAME = ".env.default";
const ENV_VALIDATION_SCHEMA_NAME = ".env.schema.json";

/**
 * Load the installed modules metadata:
 * 1. get the absolute paths of the installed Scodi modules
 * 2. loads the package.json file
 */
export async function loadModulesMetadata(
	cwd: string,
): Promise<ModulesMetadata> {
	const modulesPaths = await getPaths(cwd);

	const modulesMetadata = (await loadFiles(modulesPaths, "package.json")).map(
		(content) => JSON.parse(content) as PackageJsonModule,
	);

	const analysisModulesMap = new Map<string, PackageJsonModule>();
	const listenerModulesMap = new Map<string, PackageJsonModule>();
	const serverModulesMap = new Map<string, PackageJsonModule>();

	// as modulesPaths and modules are ordered identically,
	// we could use the index to construct the Map objects
	modulesPaths.forEach((modulePath, index) => {
		const moduleMetadata = modulesMetadata[index];

		if (moduleMetadata.scodi.type === "analysis") {
			analysisModulesMap.set(modulePath, moduleMetadata);
		} else if (
			moduleMetadata.scodi.type === "listener" ||
			moduleMetadata.scodi.type === "listener:database"
		) {
			listenerModulesMap.set(modulePath, moduleMetadata);
		} else {
			// moduleMetadata.scodi.type === "server
			serverModulesMap.set(modulePath, moduleMetadata);
		}
	});

	return [analysisModulesMap, listenerModulesMap, serverModulesMap];
}

/**
 * Load a batch of files that share the same filename but are located at different path.
 * Unexisting path does not throw errors.
 */
export async function loadFiles(
	paths: string[],
	filename: string,
): Promise<string[]> {
	const promises = paths
		.filter((path) => existsSync(path + filename))
		.map((path) => readFile(path + filename, { encoding: "utf-8" }));

	return Promise.all(promises);
}

/**
 * Check the environment variables:
 * 1. set default values
 * 2. validate the variables
 */
export async function checkEnv(modulesPaths: string[]): Promise<void> {
	modulesPaths.forEach((modulePath, _index) => {
		dotenv.config({
			path: modulePath + DOTENV_DEFAULT_VALUES_NAME,
			override: false,
		});
	});

	const schemasContent = await loadFiles(
		modulesPaths,
		ENV_VALIDATION_SCHEMA_NAME,
	);
	const schemas = schemasContent.map(
		(content) => JSON.parse(content) as AnySchema,
	);

	schemas.forEach((schema, _index) => {
		const validate = ajv.compile(schema);

		if (!validate(env)) {
			errors.push(...(validate.errors ?? []));
		}
	});

	if (errors.length > 0) {
		throw new EnvironmentError(errors);
	}
}

export async function initializeModules<M extends Module>(
	listenerModulesMap: Map<string, PackageJsonModule>,
	verbose: boolean,
): Promise<M[]> {
	const paths: string[] = [];
	const metadatas: ModuleMetadata[] = [];

	listenerModulesMap.forEach((packageJsonModule, modulePath) => {
		paths.push(modulePath + packageJsonModule.main);
		metadatas.push(packageJsonModule.scodi);
	});

	const promises = paths.map((path) => import(path) as Promise<ModuleIndex>);

	if (verbose) {
		logger.info(
			`Importing modules ${metadatas
				.map((metadata) => metadata.id)
				.join(", ")}...`,
		);
	}

	const moduleIndexes = await Promise.all(promises);

	if (verbose) {
		logger.info(
			`Modules ${metadatas
				.map((metadata) => metadata.id)
				.join(", ")} imported.`,
		);
	}

	// as Promise.all() keeps the order, the arrays paths, metadatas, promises and modules have all the exact same indexation
	return moduleIndexes.map(
		(moduleIndex, i) => moduleIndex.initialize(metadatas[i], verbose) as M,
	);
}

/**
 * Retrieve the paths of @scodi/* modules, except -cli and -common.
 * (Scodi Common must not be installed as an npm package, but who knows ¯\_(ツ)_/¯)
 * paths are guessed according to the content of the package.json
 */
async function getPaths(cwd: string): Promise<string[]> {
	const pattern = new RegExp(`^${PACKAGE_PREFIX}(?!cli|common)`);
	const packageJsonPath = `${cwd}/package.json`;
	const moduleIndex = (await import(packageJsonPath, {
		assert: { type: "json" },
	})) as { default: PackageJson };
	const packageJson = moduleIndex.default;

	// list the modules according to the given pattern
	// look into the 'dependencies' and 'devDependencies' keys
	const modulesNames: string[] = [];

	if (undefined !== packageJson.dependencies) {
		Object.keys(packageJson.dependencies)
			// add the module name to the list if it is not already there and matches the pattern
			.filter(
				(moduleName) =>
					-1 === modulesNames.indexOf(moduleName) && pattern.test(moduleName),
			)
			.forEach((moduleName: string, _index) => {
				modulesNames.push(moduleName);
			});
	}
	if (undefined !== packageJson.devDependencies) {
		Object.keys(packageJson.devDependencies)
			// add the module name to the list if it is not already there and matches the pattern
			.filter(
				(moduleName) =>
					-1 === modulesNames.indexOf(moduleName) && pattern.test(moduleName),
			)
			.forEach((moduleName: string, _index) => {
				modulesNames.push(moduleName);
			});
	}

	// list the absolute path of each modules
	const paths = modulesNames.map(
		(moduleName: string) => `${cwd}/node_modules/${moduleName}/`,
	);

	return paths;
}
