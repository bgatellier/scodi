import { spawnSync } from "node:child_process";
import type { Class } from "type-fest";
import { logger } from "../logger/logger.js";

/**
 * Get the browser executable path from the puppeteer dependency of the given dependency
 *
 * @see {@link https://github.com/puppeteer/puppeteer/issues/679#issuecomment-1274988821}
 */
export function getPuppeteerBrowserExecutablePath<T>(
	nodeModulesCwd: string,
	errorClass: Class<T>,
	verbose: boolean,
): string {
	const { stdout, error } = spawnSync(
		process.execPath,
		["-e", "console.log(require('puppeteer').executablePath())"],
		{
			cwd: nodeModulesCwd,
			encoding: "utf-8",
		},
	);

	if (error) {
		throw new errorClass(error.message, { cause: error.cause });
	}

	const executablePath = stdout.trim();

	if (verbose) {
		logger.info(`Browser path: ${executablePath}`);
	}

	return executablePath;
}
