import { afterEach, describe, expect, it, mock } from "bun:test";
import type { LighthouseConfig, ModuleMetadata } from "@scodi/common";
import type { RunnerResult } from "lighthouse";
import { LighthouseModule } from "../src/LighthouseModule.js";
import { Conf, SuccessRunnerResult } from "./data.js";

const lighthouseMock = mock(
	(): Promise<RunnerResult | undefined> => Promise.resolve(undefined),
);
mock.module("lighthouse", () => ({
	default: lighthouseMock,
}));

const moduleMetadata: ModuleMetadata = {
	id: "lighthouse-test",
	type: "analysis",
	name: "Scodi Lighthouse Test",
	service: {
		name: "Lighthouse Test",
	},
};

describe("Starts an analysis", () => {
	afterEach(() => {
		mock.restore();
	});

	it("should run an analysis with a valid configuration", async () => {
		lighthouseMock.mockResolvedValue(SuccessRunnerResult);

		const module = new LighthouseModule(moduleMetadata, true);

		const report = await module.startAnalysis(Conf);

		expect(report.analyzedUrl).toStrictEqual(Conf.url);
		expect(report).toHaveProperty("date");
		expect(report).toHaveProperty("grade");
		expect(report).toHaveProperty("normalizedGrade");
	});

	it("should not starts an analysis with an invalid configuration", async () => {
		lighthouseMock.mockResolvedValue(undefined);

		const INVALID_CONF = {
			...Conf,
			yolo: true,
		} as unknown as LighthouseConfig;
		const module = new LighthouseModule(moduleMetadata, true);

		await expect(module.startAnalysis(INVALID_CONF)).rejects.toThrow();
	});

	it("should returns true status when results match thresholds objectives", async () => {
		lighthouseMock.mockResolvedValue(SuccessRunnerResult);

		const THRESHOLD = 80;
		const module = new LighthouseModule(moduleMetadata, true);

		const report = await module.startAnalysis(Conf, THRESHOLD);

		expect(report.isThresholdReached()).toStrictEqual(true);
	});
});
