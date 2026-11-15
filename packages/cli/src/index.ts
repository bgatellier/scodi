import { existsSync } from "node:fs";
import { cwd, exit, loadEnvFile } from "node:process";
import { logger } from "@scodi/common";
import { start } from "./command/cli/CliCommand.js";

// assume that the root path is the one from where the script has been called
// /!\ this approach does not follow symlink
const CWD = cwd();

/**
 * Loads `.env` file contents into process.env.
 * Assume that the root path is the one from where the script has been called.
 * /!\ this approach does not follow symlink.
 */
const envFilePath = `${CWD}/.env`;
if (existsSync(envFilePath)) {
	loadEnvFile(envFilePath);
}

try {
	await start(CWD);
} catch (error) {
	logger.error(error);

	exit(1);
}
