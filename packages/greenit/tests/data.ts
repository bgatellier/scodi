import type { GreenITConfig } from "@scodi/common";
import type {
	BestPractices,
	JSONReport,
	Page,
} from "greenit-analysis-cli/src/cli-core/analysis.js";

const bestPractices: BestPractices = {
	AddExpiresOrCacheControlHeaders: { complianceLevel: "" },
	CompressHttp: { complianceLevel: "" },
	DomainsNumber: { complianceLevel: "" },
	DontResizeImageInBrowser: {
		complianceLevel: "",
		imgAnalysed: {},
		imagesResizedInBrowserNumber: 0,
	},
	EmptySrcTag: { complianceLevel: "" },
	ExternalizeCss: { complianceLevel: "" },
	ExternalizeJs: { complianceLevel: "" },
	HttpError: { complianceLevel: "" },
	HttpRequests: { complianceLevel: "" },
	ImageDownloadedNotDisplayed: {
		complianceLevel: "",
		imgAnalysed: {},
	},
	JsValidate: {
		complianceLevel: "",
		totalJsSize: 0,
		errors: 0,
	},
	MaxCookiesLength: { complianceLevel: "" },
	MinifiedCss: { complianceLevel: "" },
	MinifiedJs: {
		complianceLevel: "",
		totalJsSize: 0,
		minifiedJsSize: 0,
	},
	NoCookieForStaticRessources: { complianceLevel: "" },
	NoRedirect: { complianceLevel: "" },
	OptimizeBitmapImages: { complianceLevel: "" },
	OptimizeSvg: { complianceLevel: "" },
	Plugins: { complianceLevel: "" },
	PrintStyleSheet: { complianceLevel: "" },
	SocialNetworkButton: { complianceLevel: "" },
	StyleSheets: { complianceLevel: "" },
	UseETags: { complianceLevel: "" },
	UseStandardTypefaces: { complianceLevel: "" },
};

const page: Page = {
	name: "",
	nbRequest: 0,
	responsesSize: 0,
	responsesSizeUncompress: 0,
	url: "https://www.ipcc.ch/",
	bestPractices: bestPractices,
	actions: [
		{
			ecoIndex: 28,
			domSize: 0,
			nbRequest: 0,
			responsesSize: 0,
			responsesSizeUncompress: 0,
			grade: "E",
			waterConsumption: 0,
			greenhouseGasesEmission: 0,
			pluginsNumber: 0,
			printStyleSheetsNumber: 0,
			inlineStyleSheetsNumber: 0,
			emptySrcTagNumber: 0,
			inlineJsScriptsNumber: 0,
			imagesResizedInBrowser: [],
			bestPractices: bestPractices,
		},
	],
};

const SuccessReport: JSONReport = {
	success: true,
	pageInformations: {
		url: "https://www.ipcc.ch",
	},
	nbBestPracticesToCorrect: 13,
	date: "09/02/2023 23:32:57",
	tryNb: 1,
	tabId: 0,
	index: 0,
	url: "https://www.ipcc.ch/",
	pages: [page],
};

const ErrorReport: JSONReport = {
	success: false,
	nbBestPracticesToCorrect: 0,
	date: "04/05/2022 09:59:52",
	pageInformations: {
		url: "https://www.ipcc.ch/",
	},
	tryNb: 3,
	tabId: 0,
	index: 0,
	url: "https://www.ipcc.ch/",
	pages: [page],
};

const Conf: GreenITConfig = {
	url: "https://www.ipcc.ch",
	device: "iPhoneX",
	timeout: 5000,
};

export { Conf, SuccessReport, ErrorReport };
