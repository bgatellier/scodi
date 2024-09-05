import type { SizeNames } from "../sizes";
import type { Translator } from "./translator";

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

interface BestPracticeBase {
	comment?: string;
	complianceLevel: string;
	detailComment?: string;
}

interface BestPratices {
	AddExpiresOrCacheControlHeaders: BestPracticeBase;
	CompressHttp: BestPracticeBase;
	DomainsNumber: BestPracticeBase;
	DontResizeImageInBrowser: BestPracticeBase & {
		imgAnalysed: object;
		imagesResizedInBrowserNumber: number;
	};
	EmptySrcTag: BestPracticeBase;
	ExternalizeCss: BestPracticeBase;
	ExternalizeJs: BestPracticeBase;
	HttpError: BestPracticeBase;
	HttpRequests: BestPracticeBase;
	ImageDownloadedNotDisplayed: BestPracticeBase & {
		imgAnalysed: object;
	};
	JsValidate: BestPracticeBase & {
		totalJsSize: number;
		errors: number;
	};
	MaxCookiesLength: BestPracticeBase;
	MinifiedCss: BestPracticeBase;
	MinifiedJs: BestPracticeBase & {
		totalJsSize: number;
		minifiedJsSize: number;
	};
	NoCookieForStaticRessources: BestPracticeBase;
	NoRedirect: BestPracticeBase;
	OptimizeBitmapImages: BestPracticeBase;
	OptimizeSvg: BestPracticeBase;
	Plugins: BestPracticeBase;
	PrintStyleSheet: BestPracticeBase;
	SocialNetworkButton: BestPracticeBase;
	StyleSheets: BestPracticeBase;
	UseETags: BestPracticeBase;
	UseStandardTypefaces: BestPracticeBase;
}

interface GeneralProperties {
	success: boolean;
	nbBestPracticesToCorrect: number;
	// format: 2024-8-25T11:34:16
	date: string;
	pageInformations: { url: string };
	tryNb: number;
	tabId: number;
	index: number;
	url: string;
}

interface KPIProperties {
	ecoIndex: number;
	domSize: number;
	nbRequest: number;
	responsesSize: number;
	responsesSizeUncompress: number;
	grade: string;
	waterConsumption: number;
	greenhouseGasesEmission: number;
	pluginsNumber: number;
	printStyleSheetsNumber: number;
	inlineStyleSheetsNumber: number;
	emptySrcTagNumber: number;
	inlineJsScriptsNumber: number;
	imagesResizedInBrowser: Array<{
		src: string;
		clientWidth: number;
		clientHeight: number;
		naturalWidth: number;
		naturalHeight: number;
	}>;
	bestPractices: BestPratices;
}

interface Page {
	name: string;
	bestPractices: BestPratices;
	nbRequest: number;
	responsesSize: number;
	responsesSizeUncompress: number;
	url: string;
	actions: [KPIProperties, ...KPIProperties[]]; // at least 1 KPIProperties
}

declare function createJsonReports(
	/** @type { Browser } Puppeteer Browser */
	browser: unknown,
	pagesInformations: PageInformation[],
	options: Options,
	proxy: Proxy | Record<string, never>,
	headers: Record<string, string> | undefined,
	translator: Translator,
): Promise<Report[]>;

/**
 * Type of the JSON file produced by the greenit-cli package on a successful analysis.
 * This JSON file is written on the file system by the package.
 */
type JSONReport = GeneralProperties & {
	pages: [Page, ...Page[]]; // at least 1 Page
};

export {
	type GeneralProperties,
	type KPIProperties,
	createJsonReports,
	type JSONReport,
	type Options,
};
