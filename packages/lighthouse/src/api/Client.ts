import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
	type LighthouseConfig,
	type LighthouseReport,
	getPuppeteerBrowserExecutablePath,
} from "@scodi/common";
import lighthouse from "lighthouse";
import puppeteer from "puppeteer-core";
import { LighthouseError } from "../error/LighthouseError.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/**
 * @see {@link https://github.com/GoogleChrome/lighthouse/blob/main/docs/puppeteer.md#option-1-launch-chrome-with-puppeteer-and-handoff-to-lighthouse}
 */
export async function requestResult(
	conf: LighthouseConfig,
	verbose: boolean,
): Promise<LighthouseReport["result"]> {
	const executablePath = getPuppeteerBrowserExecutablePath(
		join(__dirname, "../../node_modules/lighthouse"),
		LighthouseError,
		verbose,
	);

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

	try {
		const runnerResult = await lighthouse(
			conf.url,
			{ output: "json", logLevel: verbose ? "info" : undefined },
			conf.config,
			page,
		);

		if (undefined === runnerResult) {
			throw new LighthouseError(
				"The analysis ran, but Lighthouse did not return any result. Try to start your analysis again.",
			);
		}

		return { ...runnerResult.lhr }; // hacky thing to fix weird typing error
	} catch (error) {
		if (typeof error === "string") {
			throw new LighthouseError(error);
		}

		if (error instanceof Error) {
			throw new LighthouseError(error.message);
		}

		throw error;
	} finally {
		await browser.close();
	}
}
