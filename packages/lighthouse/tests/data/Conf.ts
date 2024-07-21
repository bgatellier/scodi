import type { LighthouseConfig } from "@scodi/common";

export const Conf: LighthouseConfig = {
	url: "https://www.ipcc.ch",
	config: {
		extends: "lighthouse:default",
		settings: {
			onlyAudits: [
				"first-meaningful-paint",
				"speed-index",
				"first-cpu-idle",
				"interactive",
			],
		},
	},
};
