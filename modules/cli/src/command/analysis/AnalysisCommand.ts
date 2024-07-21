import {
	type Config,
	type GenericReport,
	InputError,
	type ModuleAnalysisInterface,
	type ModuleListenerDatabaseInterface,
	type ModuleListenerInterface,
	type ModuleMetadata,
	type ParsedAnalysisInput,
	type Result,
	isModuleListenerDatabase,
	validateAnalysisInput,
} from "@scodi/common";
import { Command, InvalidArgumentError } from "commander";
import { checkEnv, initializeModules } from "../../module/ModuleLoader.js";
import { migrateListenerDatabase } from "../../module/ModuleMigration.js";
import {
	notifyListenerModules,
	startAnalysis,
} from "../../module/ModuleOrchestrator.js";
import type { PackageJsonModule } from "../../module/PackageJson.js";
import { type CommonOptions, createVerboseOption } from "../CommonOption.js";
import {
	type AnalysisOptions,
	createConfigOption,
	createExceptListenersOption,
	createOnlyListenersOption,
	createThresholdOption,
} from "./AnalysisOption.js";

type AnalysisSubcommandCallback = <C extends Config>(
	verbose: boolean,
	config: C,
	threshold: number | undefined,
	listenerModulesMetadataMapFiltered: Map<string, PackageJsonModule>,
) => Promise<void>;

function prepareOptionsForValidation(
	options: AnalysisOptions,
): ParsedAnalysisInput {
	return {
		config: options.config,
		threshold: options.threshold,
		except_listeners: options.exceptListeners,
		only_listeners: options.onlyListeners,
		verbose: options.verbose,
	};
}

/**
 * Create a command dedicated to the given analysis module
 */
export const createAnalysisSubcommand = <C extends Config>(
	moduleMetadata: ModuleMetadata,
	listenerModulesMetadataMap: Map<string, PackageJsonModule>,
	callback: AnalysisSubcommandCallback,
): Command => {
	const subcommand = new Command(moduleMetadata.id);

	subcommand
		.description(`Analyzes a URL with ${moduleMetadata.service.name}`)
		.addOption(createVerboseOption())
		.addOption(createConfigOption())
		.addOption(createThresholdOption())
		.addOption(createExceptListenersOption())
		.addOption(createOnlyListenersOption())
		.action(async (options: CommonOptions & AnalysisOptions) => {
			const listenerModulesIds = new Array<string>();
			listenerModulesMetadataMap.forEach((metadata, _key) => {
				listenerModulesIds.push(metadata.scodi.id);
			});

			try {
				const unvalidatedInputs = prepareOptionsForValidation(options);
				const { config, threshold, except_listeners, only_listeners } =
					validateAnalysisInput(unvalidatedInputs, listenerModulesIds);

				// reduce the listener modules that will be triggered at the end of the analysis
				// if the --except-listeners or --only-listeners options are used.
				// the options are mutually exclusive (see the validation above), that why there is an if/else.
				if (except_listeners !== undefined) {
					listenerModulesMetadataMap.forEach((metadata, modulePath, m) => {
						if (except_listeners.includes(metadata.scodi.id)) {
							m.delete(modulePath);
						}
					});
				} else if (only_listeners !== undefined) {
					listenerModulesMetadataMap.forEach((metadata, modulePath, m) => {
						if (!only_listeners.includes(metadata.scodi.id)) {
							m.delete(modulePath);
						}
					});
				}

				await callback(
					options.verbose,
					config as C,
					threshold,
					listenerModulesMetadataMap,
				);
			} catch (error) {
				const e =
					error instanceof InputError
						? new InvalidArgumentError(error.cause[0].message ?? error.message)
						: error;

				return Promise.reject(e);
			}
		});

	return subcommand;
};

/**
 * Callback function called once the CLI command has been executed (the user hit "enter").
 * @param config
 * @param threshold
 * @param listenerModulesMetadataMap Filtered map of listener modules metadata and their file path
 */
export function createAnalysisSubcommandCallback(
	packageJsonModule: PackageJsonModule,
	modulePath: string,
): AnalysisSubcommandCallback {
	return async <C extends Config>(
		verbose: boolean,
		config: C,
		threshold: number | undefined,
		listenerModulesMetadataMap: Map<string, PackageJsonModule>,
	) => {
		await checkEnv([modulePath, ...listenerModulesMetadataMap.keys()]);

		// initialize the modules
		const analysisModules = await initializeModules<
			ModuleAnalysisInterface<Config, GenericReport<Result>>
		>(new Map([[modulePath, packageJsonModule]]), verbose);
		const listenerModules = await initializeModules<ModuleListenerInterface>(
			listenerModulesMetadataMap,
			verbose,
		);

		// run database migrations for listener database modules
		const listenerDatabaseModules = listenerModules.filter(
			(listenerModule): listenerModule is ModuleListenerDatabaseInterface =>
				isModuleListenerDatabase(listenerModule),
		);
		if (listenerDatabaseModules.length > 0) {
			await migrateListenerDatabase(listenerDatabaseModules);
		}

		const report = await startAnalysis(analysisModules[0], config, threshold);

		// notify the listener modules
		await notifyListenerModules(listenerModules, report);
	};
}
