import type {
	EntityManager,
	EntityManagerType,
	IDatabaseDriver,
	Options,
} from "@mikro-orm/core";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { ReportEntity } from "../../entities/ReportEntity.js";
import { ServiceEntity } from "../../entities/ServiceEntity.js";

const DB_NAME = "scodi";

export function createDatabaseConfig<
	D extends IDatabaseDriver,
	EM extends D[typeof EntityManagerType] & EntityManager<D>,
>(options: Partial<Options<D, EM>>): Partial<Options<D, EM>> {
	options.dbName = DB_NAME;
	options.entities = [ReportEntity, ServiceEntity];
	options.metadataProvider = TsMorphMetadataProvider;

	if (options.migrations) {
		options.migrations.snapshot = false;
	}

	return options;
}
