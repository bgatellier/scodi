import type { ObservatoryReport } from "@scodi/common";
import type { MrkdwnElement, SectionBlock } from "@slack/web-api";

export const formatObservatoryBlocks = (
	_report: ObservatoryReport,
): [MrkdwnElement[], SectionBlock[]] => {
	return [[], []];
};
