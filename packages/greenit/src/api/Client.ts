import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { type GreenITConfig, type GreenITReport, logger } from "@scodi/common";
import { execa } from "execa";
import {
	type JSONReport,
	type Options,
	createJsonReports,
} from "greenit-cli/cli-core/analysis.js";
import { translator } from "greenit-cli/cli-core/translator.js";
import puppeteer from "puppeteer-core";
import { GreenITError } from "../error/GreenITError.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const DEFAULT_OPTIONS: Options = {
	ci: true,
	device: "desktop",
	language: "en",
	max_tab: 40,
	retry: 2,
	timeout: 180000,
};

export async function requestResult(
	config: GreenITConfig,
	verbose: boolean,
): Promise<GreenITReport["result"]> {
	const executablePath = await getBrowserExecutablePath(verbose);
	const options = createOptions(config);

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

	// As the createJsonReports use console.* functions to display progress info and errors and do not send back these information,
	// so we need to disable the console.* functions during this operation to handle the output ourselves.
	const consoleLog = console.log;
	const consoleError = console.error;

	try {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		console.log = () => {};
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		console.error = () => {};

		const reports = await createJsonReports(
			browser,
			[{ url: config.url }],
			options,
			{},
			undefined,
			translator,
		);

		const jsonReport = JSON.parse(
			readFileSync(reports[0].path, { encoding: "utf-8" }),
		) as JSONReport;

		if (jsonReport.success === false) {
			return Promise.reject(
				new GreenITError(
					"Error during GreenIT analysis. Increasing the timeout can be a solution",
				),
			);
		}

		return {
			...jsonReport.pages[0].actions[0],
			...{
				success: jsonReport.success,
				nbBestPracticesToCorrect: jsonReport.nbBestPracticesToCorrect,
				date: jsonReport.date,
				pageInformations: jsonReport.pageInformations,
				tryNb: jsonReport.tryNb,
				tabId: jsonReport.tabId,
				index: jsonReport.index,
				url: jsonReport.url,
			},
		};
	} catch (error) {
		if (typeof error === "string") {
			return Promise.reject(new GreenITError(error));
		}

		if (error instanceof Error) {
			return Promise.reject(new GreenITError(error.message));
		}

		return Promise.reject(error);
	} finally {
		console.log = consoleLog;
		console.error = consoleError;
		await browser.close();
	}
}

function createOptions(config: GreenITConfig): Options {
	return {
		ci: DEFAULT_OPTIONS.ci,
		device: config.device ?? DEFAULT_OPTIONS.device,
		language: config.language ?? DEFAULT_OPTIONS.language,
		max_tab: DEFAULT_OPTIONS.max_tab,
		retry: config.retry ?? DEFAULT_OPTIONS.retry,
		timeout: config.timeout ?? DEFAULT_OPTIONS.timeout,
	};
}

/**
 * Get the browser executable path from the puppeteer dependency of the greenit-cli dependency
 *
 * @see {@link https://github.com/puppeteer/puppeteer/issues/679#issuecomment-1274988821}
 */
async function getBrowserExecutablePath(verbose: boolean): Promise<string> {
	try {
		const { stdout } = await execa({
			cwd: join(__dirname, "../../node_modules/greenit-cli"),
			encoding: "utf8",
		})`node ${["-e", "console.log(require('puppeteer').executablePath())"]}`;

		if (verbose) {
			logger.info(`Browser path: ${stdout}`);
		}

		return stdout;
	} catch (error) {
		if (typeof error === "string") {
			return Promise.reject(new GreenITError(error));
		}

		if (error instanceof Error) {
			return Promise.reject(new GreenITError(error.message));
		}

		return Promise.reject(error);
	}
}
