import { env } from "node:process";
import { Migrator } from "@mikro-orm/migrations";
import { defineConfig } from "@mikro-orm/mysql";
import { createDatabaseConfig } from "@scodi/common";
import { Migration20230702150637 } from "../migrations/Migration20230702150637.js";

export default defineConfig(
	createDatabaseConfig({
		clientUrl: env.SCODI_MYSQL_DATABASE_URL ?? "",
		extensions: [Migrator],
		migrations: {
			migrationsList: [
				{
					name: "Migration20230702150637",
					class: Migration20230702150637,
				},
			],
		},
		charset: "utf8mb4",
		collate: "utf8mb4_general_ci",
	}),
);
