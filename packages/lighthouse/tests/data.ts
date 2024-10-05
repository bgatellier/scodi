import type { LighthouseConfig } from "@scodi/common";
import type { RunnerResult } from "lighthouse";

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

export const SuccessRunnerResult = {
	lhr: {
		categories: {
			category1: { score: 0.95 },
			category2: { score: 0.9 },
			category3: { score: 0.95 },
			category4: { score: 0.9 },
			category5: { score: 0.8 },
		},
		requestedUrl: Conf.url,
		fetchTime: "1584540399",
	},
} as unknown as RunnerResult;
