import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
	type LighthouseConfig,
	type LighthouseReport,
	logger,
} from "@scodi/common";
import { execa } from "execa";
import lighthouse from "lighthouse";
import puppeteer from "puppeteer-core";
import { Lighthouse } from "../error/LighthouseError.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/**
 * @see {@link https://github.com/GoogleChrome/lighthouse/blob/main/docs/puppeteer.md#option-2-launch-chrome-with-lighthousechrome-launcher-and-handoff-to-puppeteer}
 */
export async function requestResult(
	conf: LighthouseConfig,
	verbose: boolean,
): Promise<LighthouseReport["result"]> {
	const executablePath = await getBrowserExecutablePath(verbose);

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
async function getBrowserExecutablePath(verbose: boolean): Promise<string> {
	try {
		const { stdout } = await execa({
			cwd: join(__dirname, "../../node_modules/lighthouse"),
			encoding: "utf8",
		})`node ${["-e", "console.log(require('puppeteer').executablePath())"]}`;

		if (verbose) {
			logger.info(`Browser path: ${stdout}`);
		}

		return stdout;
	} catch (error) {
		if (typeof error === "string") {
			return Promise.reject(new Lighthouse(error));
		}

		if (error instanceof Error) {
			return Promise.reject(new Lighthouse(error.message));
		}

		return Promise.reject(error);
	}
}
