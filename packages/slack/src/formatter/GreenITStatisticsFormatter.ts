import type { GreenITReport } from "@scodi/common";
import type { MrkdwnElement, SectionBlock } from "@slack/web-api";
import { MAX_TEXT_BLOCK_LENGTH } from "./BlocksFormatter.js";

/**
 * Formatting layout is inspired by https://www.ecoindex.fr/
 * @returns An array with the metrics and advices blocks (in that order)
 */
export const formatGreenITBlocks = (
	report: GreenITReport,
): [MrkdwnElement[], SectionBlock[]] => {
	const metricsBlocks: MrkdwnElement[] = [
		{
			type: "mrkdwn",
			text: `*Page weight*: ${(report.result.responsesSize / 1000000).toFixed(
				2,
			)} Mo`,
		},
		{
			type: "mrkdwn",
			text: `*DOM elements*: ${report.result.domSize}`,
		},
		{
			type: "mrkdwn",
			text: `*Network requests*: ${report.result.nbRequest}`,
		},
	];

	// only keep bestPractices that have comment and detailComment set (it seems that these are the ones that need improvement)
	const advicesBlocks: SectionBlock[][] = Object.values(
		report.result.bestPractices,
	)
		.filter(
			(bestPractice) =>
				bestPractice.comment !== undefined &&
				bestPractice.detailComment !== undefined,
		)
		.map((bestPractice) => {
			// as the bestPractice.detailComment could be more than MAX_TEXT_BLOCK_LENGTH characters long,
			// we need to create several sections.
			const lines = (bestPractice.detailComment as string)
				.split("<br>")
				.filter((line) => line.length > 0);

			const sections: SectionBlock[] = [];

			let lineAcc = "";
			lines.forEach((line, _index) => {
				const newLine = `\n- ${line}`;
				if (lineAcc.length + newLine.length <= MAX_TEXT_BLOCK_LENGTH) {
					lineAcc += newLine;
				} else {
					sections.push({
						type: "section",
						text: {
							type: "mrkdwn",
							text: lineAcc,
						},
					});
					lineAcc = newLine;
				}
			});
			if (lineAcc.length > 0) {
				sections.push({
					type: "section",
					text: {
						type: "mrkdwn",
						text: lineAcc,
					},
				});
			}

			return [
				{
					type: "section",
					text: {
						type: "mrkdwn",
						text: `*${bestPractice.comment}*`,
					},
				},
				...sections,
			];
		});

	return [metricsBlocks, advicesBlocks.flat()];
};
