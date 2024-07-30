import type { LighthouseConfig, LighthouseReport } from "@scodi/common";

export async function requestResult(
	conf: LighthouseConfig,
	_verbose: boolean,
): Promise<LighthouseReport["result"]> {
	return {
		categories: {
			category1: { score: 0.95 },
			category2: { score: 0.9 },
			category3: { score: 0.95 },
			category4: { score: 0.9 },
			category5: { score: 0.8 },
		},
		requestedUrl: conf.url,
		fetchTime: 1584540399,
	} as unknown as LighthouseReport["result"];
}
