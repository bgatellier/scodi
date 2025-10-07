import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
	type GreenITConfig,
	type GreenITReport,
	getPuppeteerBrowserExecutablePath,
} from "@scodi/common";
import {
	createJsonReports,
	type JSONReport,
	type Options,
} from "greenit-analysis-cli/src/cli-core/analysis.js";
import { translator } from "greenit-analysis-cli/src/cli-core/translator.js";
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
	const executablePath = getPuppeteerBrowserExecutablePath(
		join(__dirname, "../../node_modules/greenit-analysis-cli"),
		GreenITError,
		verbose,
	);
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
			throw new GreenITError(
				"Error during GreenIT analysis. Increasing the timeout can be a solution",
			);
		}

		return {
			...jsonReport.pages[0].actions[0],
			success: jsonReport.success,
			nbBestPracticesToCorrect: jsonReport.nbBestPracticesToCorrect,
			date: jsonReport.date,
			pageInformations: jsonReport.pageInformations,
			tryNb: jsonReport.tryNb,
			tabId: jsonReport.tabId,
			index: jsonReport.index,
			url: jsonReport.url,
		};
	} catch (error) {
		if (typeof error === "string") {
			throw new GreenITError(error);
		}

		if (error instanceof Error) {
			throw new GreenITError(error.message);
		}

		throw error;
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
