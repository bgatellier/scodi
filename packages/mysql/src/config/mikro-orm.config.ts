import { env } from "node:process";
import { defineConfig, type MySqlDriver } from "@mikro-orm/mysql";
import { createDatabaseConfig } from "@scodi/common";
import { Migration20230702150637 } from "../migrations/Migration20230702150637.js";

export default defineConfig(
	createDatabaseConfig<MySqlDriver>({
		clientUrl: env.SCODI_MYSQL_DATABASE_URL ?? "",
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
