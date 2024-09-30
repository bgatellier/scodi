import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
	type LighthouseConfig,
	type LighthouseReport,
	logger,
} from "@scodi/common";
import lighthouse from "lighthouse";
import puppeteer from "puppeteer-core";
import { LighthouseError } from "../error/LighthouseError.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/**
 * @see {@link https://github.com/GoogleChrome/lighthouse/blob/main/docs/puppeteer.md#option-2-launch-chrome-with-lighthousechrome-launcher-and-handoff-to-puppeteer}
 */
export async function requestResult(
	conf: LighthouseConfig,
	verbose: boolean,
): Promise<LighthouseReport["result"]> {
	const executablePath = getBrowserExecutablePath(verbose);

	const browser = await puppeteer.launch({
		executablePath: executablePath,
		// https://www.howtogeek.com/devops/how-to-run-puppeteer-and-headless-chrome-in-a-docker-container/#using-puppeteer-in-docker
		args: [
			"--disable-gpu",
			"--disable-dev-shm-usage",
			"--disable-setuid-sandbox",
			"--no-sandbox",
		],
		defaultViewport: null,
	});
	const page = await browser.newPage();

	const runnerResult = await lighthouse(
		conf.url,
		{ output: "json", logLevel: verbose ? "info" : undefined },
		conf.config,
		page,
	);
	if (undefined === runnerResult) {
		return Promise.reject(
			"The analysis run, but Lighthouse did not return any result. Try to start your analysis again.",
		);
	}

	await browser.close();

	return { ...runnerResult.lhr }; // hacky thing to fix weird typing error
}

/**
 * Get the browser executable path from the puppeteer dependency of the greenit-cli dependency
 *
 * @see {@link https://github.com/puppeteer/puppeteer/issues/679#issuecomment-1274988821}
 */
function getBrowserExecutablePath(verbose: boolean): string {
	const { stdout, error } = spawnSync(
		process.execPath,
		["-e", "console.log(require('puppeteer').executablePath())"],
		{
			cwd: join(__dirname, "../../node_modules/lighthouse"),
			encoding: "utf-8",
		},
	);

	if (error) {
		throw new LighthouseError(error.message, { cause: error.cause });
	}

	const executablePath = stdout.trim();

	if (verbose) {
		logger.info(`Browser path: ${executablePath}`);
	}

	return executablePath;
}
