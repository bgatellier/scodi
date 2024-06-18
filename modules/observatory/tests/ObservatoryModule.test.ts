import {
	type ObservatoryConfig,
	ObservatoryReport,
} from "@fabernovel/heart-common";
import { describe, expect, it, vi } from "vitest";
import { RESULT } from "./data/Result.js";
import { ObservatoryModule } from "../src/ObservatoryModule.js";
import { Client } from "../src/api/Client.js";

const ANALYZE_URL = "www.observatory.mozilla-test/results/";
const CONF: ObservatoryConfig = { host: "heart.fabernovel.com" };

vi.spyOn(Client.prototype, "getAnalyzeUrl").mockImplementation(
	() => ANALYZE_URL + CONF.host,
);
vi.spyOn(Client.prototype, "requestScan").mockImplementation(() =>
	Promise.resolve(RESULT.scan),
);
vi.spyOn(Client.prototype, "requestTests").mockImplementation(() =>
	Promise.resolve(RESULT.tests),
);
vi.spyOn(Client.prototype, "triggerAnalysis").mockImplementation(() =>
	Promise.resolve(RESULT.scan),
);

describe("Starts an analysis", () => {
	const module = new ObservatoryModule(
		{
			id: "observatory-test",
			type: "analysis",
			name: "Heart Observatory Test",
			service: {
				name: "Observatory Test",
			},
		},
		false,
	);

	it("Should start an analysis with a valid configuration without a threshold", async () => {
		const report = await module.startAnalysis(CONF);

		const expectedReport = new ObservatoryReport({
			analyzedUrl: "heart.fabernovel.com",
			date: report.date,
			inputs: {
				config: CONF,
			},
			result: RESULT,
			resultUrl: `${ANALYZE_URL}heart.fabernovel.com`,
			service: {
				name: "Observatory Test",
			},
		});

		expect(report).toEqual(expectedReport);
	});

	it("Should throw an error with an invalid configuration", async () => {
		try {
			await module.startAnalysis({} as ObservatoryConfig);
		} catch (e) {
			expect(e).toHaveProperty("error");
		}
	});

	it("Should start an analysis with an empty threshold", async () => {
		const report = await module.startAnalysis(CONF);

		const expectedReport = new ObservatoryReport({
			analyzedUrl: "heart.fabernovel.com",
			date: report.date,
			inputs: {
				config: CONF,
			},
			result: RESULT,
			resultUrl: `${ANALYZE_URL}heart.fabernovel.com`,
			service: {
				name: "Observatory Test",
			},
		});

		expect(report).toStrictEqual(expectedReport);
		expect(report).toHaveProperty("inputs", { config: CONF });
	});

	it("Should return false status when results do not match threshold objective", async () => {
		const THRESHOLD = 98;
		const report = await module.startAnalysis(CONF, THRESHOLD);

		const expectedReport = new ObservatoryReport({
			analyzedUrl: "heart.fabernovel.com",
			date: report.date,
			inputs: {
				config: CONF,
				threshold: THRESHOLD,
			},
			result: RESULT,
			resultUrl: `${ANALYZE_URL}heart.fabernovel.com`,
			service: {
				name: "Observatory Test",
			},
		});

		expect(report).toStrictEqual(expectedReport);
		expect(report.isThresholdReached()).toEqual(false);
	});
});
