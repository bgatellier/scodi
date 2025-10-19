import type { ObservatoryConfig, ObservatoryReport } from "@scodi/common";

export function generateMockResult(
	config: ObservatoryConfig,
): ObservatoryReport["result"] {
	return {
		id: 77666718,
		details_url: `https://developer.mozilla.org/en-US/observatory/analyze?host=${config.host}`,
		algorithm_version: 4,
		scanned_at: "2024-08-12T08:20:18.926Z",
		error: null,
		grade: "B",
		score: 95,
		status_code: 200,
		tests_failed: 0,
		tests_passed: 10,
		tests_quantity: 10,
	};
}
