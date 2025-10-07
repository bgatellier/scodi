import {
	type GenericReport,
	logger,
	Module,
	type ModuleListenerDatabaseInterface,
	type ModuleMetadata,
	type Result,
} from "@scodi/common";
import { MySQLClient } from "./client/Client.js";

export class MySQLModule
	extends Module
	implements ModuleListenerDatabaseInterface
{
	readonly #client: MySQLClient;

	constructor(moduleMetadata: ModuleMetadata, verbose: boolean) {
		super(moduleMetadata, verbose);

		this.#client = new MySQLClient(verbose);

		if (verbose) {
			logger.info(`${moduleMetadata.name} initialized.`);
		}
	}

	public async hasPendingMigrations(): Promise<boolean> {
		const migrator = await this.#client.getMigrator();

		const migrations = await migrator.getPendingMigrations();

		return migrations.length > 0;
	}

	public async runPendingMigrations(): Promise<void> {
		const migrator = await this.#client.getMigrator();

		await migrator.up();
	}

	public async notifyAnalysisDone(
		report: GenericReport<Result>,
	): Promise<void> {
		try {
			await this.#client.save(report);
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}
}
