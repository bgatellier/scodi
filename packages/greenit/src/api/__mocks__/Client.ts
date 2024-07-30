import type { GreenITConfig, GreenITReport } from "@scodi/common";

export async function requestResult(
	_conf: GreenITConfig,
): Promise<GreenITReport["result"]> {
	return {
		url: "https://www.ipcc.ch/",
		success: true,
		nbBestPracticesToCorrect: 13,
		grade: "E",
		ecoIndex: 28,
		pageInformations: {
			url: "https://www.ipcc.ch",
		},
		date: "09/02/2023 23:32:57",
		tryNb: 1,
		tabId: 0,
		index: 0,
	} as unknown as GreenITReport["result"];
}
