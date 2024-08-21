import type { Config } from "../Config.js";

type SizeNames =
	| "desktop"
	| "galaxyS9"
	| "galaxyS20"
	| "iPhone8"
	| "iPhone8Plus"
	| "iPhoneX"
	| "iPad";

interface Options {
	// Hardware to simulate
	device: SizeNames;
	// Report language
	language?: "en" | "fr";
	// Number of retry when an analysis of a URL fail
	retry?: number;
	// Timeout for an analysis of a URL in ms
	timeout?: number;
}

export type GreenITConfig = Config &
	Options & {
		url: string;
	};
