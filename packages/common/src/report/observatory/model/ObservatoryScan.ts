import type { ObservatoryScanGrade } from "../enum/ObservatoryScanGrade.js";

/**
 * @see {@link https://github.com/mdn/mdn-http-observatory/tree/main?tab=readme-ov-file#result}
 */
export interface ObservatoryScan {
	id: number;
	details_url: string;
	algorithm_version: number;
	scanned_at: string;
	error: null;
	grade: ObservatoryScanGrade;
	score: number;
	status_code: number;
	tests_failed: number;
	tests_passed: number;
	tests_quantity: number;
}
