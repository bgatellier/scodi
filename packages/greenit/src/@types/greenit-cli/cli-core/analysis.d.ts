declare module "greenit-cli/cli-core/analysis.js" {
	import type { SizeNames } from "greenit-cli";
	import type { Browser } from "puppeteer";
	import type { Translator } from "greenit-cli/cli-core/translator.js";

	interface Action {
		type: "click" | "text" | "select" | "scroll";
		element: string;
		content: unknown;
		timeoutBefore: number;
		values: unknown;
	}

	interface PageInformation {
		url: string;
		screenshot?: string;
		actions?: Action[] | { screenshot: string };
		waitForSelector?: string;
		waitForXPath?: string;
	}

	interface Options {
		ci: boolean;
		// Hardware to simulate
		device: SizeNames;
		// Report language
		language: "fr" | "en";
		// Number of concurrent analysis
		max_tab: number;
		// Number of retry when an analysis of a URL fail
		retry: number;
		// Timeout for an analysis of a URL in ms
		timeout: number;
	}

	interface Proxy {
		user: string;
		password: string;
	}

	interface Report {
		name: string;
		path: string;
	}

	export function createJsonReports(
		browser: Browser,
		pagesInformations: PageInformation[],
		options: Options,
		proxy: Proxy | Record<string, never>,
		headers: Record<string, string> | undefined,
		translator: Translator,
	): Promise<Report[]>;
}
