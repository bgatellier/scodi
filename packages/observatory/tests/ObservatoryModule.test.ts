import {
	afterAll,
	beforeAll,
	describe,
	expect,
	it,
	mock,
	spyOn,
} from "bun:test";
import { type ObservatoryConfig, ObservatoryReport } from "@scodi/common";
import { Client } from "../src/api/Client.js";
import { ObservatoryModule } from "../src/ObservatoryModule.js";
import { generateMockResult } from "./data/Result.js";

const MOCK_CONF: ObservatoryConfig = { host: "ipcc.ch" };
const MOCK_RESULT = generateMockResult(MOCK_CONF);

describe("Starts an analysis", () => {
	beforeAll(() => {
		spyOn(Client.prototype, "requestResult").mockImplementation(() =>
			Promise.resolve(MOCK_RESULT),
		);
	});

	afterAll(() => {
		mock.restore();
	});

	const module = new ObservatoryModule(
		{
			id: "observatory-test",
			type: "analysis",
			name: "Scodi Observatory Test",
			service: {
				name: "Observatory Test",
			},
		},
		false,
	);

	it("Should start an analysis with a valid configuration without a threshold", async () => {
		const report = await module.startAnalysis(MOCK_CONF);

		const expectedReport = new ObservatoryReport({
			analyzedUrl: "ipcc.ch",
			date: report.date,
			inputs: {
				config: MOCK_CONF,
			},
			result: MOCK_RESULT,
			resultUrl: MOCK_RESULT.details_url,
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
		const report = await module.startAnalysis(MOCK_CONF);

		const expectedReport = new ObservatoryReport({
			analyzedUrl: "ipcc.ch",
			date: report.date,
			inputs: {
				config: MOCK_CONF,
			},
			result: MOCK_RESULT,
			resultUrl: MOCK_RESULT.details_url,
			service: {
				name: "Observatory Test",
			},
		});

		expect(report).toStrictEqual(expectedReport);
		expect(report).toHaveProperty("inputs", { config: MOCK_CONF });
	});

	it("Should return false status when results do not match threshold objective", async () => {
		const THRESHOLD = 98;
		const report = await module.startAnalysis(MOCK_CONF, THRESHOLD);

		const expectedReport = new ObservatoryReport({
			analyzedUrl: "ipcc.ch",
			date: report.date,
			inputs: {
				config: MOCK_CONF,
				threshold: THRESHOLD,
			},
			result: MOCK_RESULT,
			resultUrl: MOCK_RESULT.details_url,
			service: {
				name: "Observatory Test",
			},
		});

		expect(report).toStrictEqual(expectedReport);
		expect(report.isThresholdReached()).toEqual(false);
	});
});
