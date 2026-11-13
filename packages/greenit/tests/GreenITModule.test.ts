import { afterEach, beforeAll, describe, expect, it, mock } from "bun:test";
import type { ModuleMetadata } from "@scodi/common";
import type { createJsonReports } from "greenit-analysis-cli/src/cli-core/analysis.js";
import { fs as memfsFs, vol } from "memfs";
import { GreenITModule } from "../src/GreenITModule.js";
import { Conf, ErrorReport, SuccessReport } from "./data.js";

const createJsonReportsMock = mock<typeof createJsonReports>();
mock.module("greenit-analysis-cli/src/cli-core/analysis.js", () => ({
	createJsonReports: createJsonReportsMock,
}));

// Redirect only readFileSync to the in-memory fs: other fs functions must keep
// hitting the real fs (e.g. puppeteer checks the browser binary with existsSync)
const realFs = process.getBuiltinModule("node:fs");
mock.module("node:fs", () => ({
	...realFs,
	readFileSync: memfsFs.readFileSync,
}));

describe("Run GreenIT analysis", () => {
	beforeAll(() => {
		// mock the file system and put on it these 2 mocked reports
		vol.fromJSON({
			"./ErrorReport.json": JSON.stringify(ErrorReport),
			"./SuccessReport.json": JSON.stringify(SuccessReport),
		});
	});

	afterEach(() => {
		mock.restore();
	});

	it("should run a successful analysis without thresholds", async () => {
		createJsonReportsMock.mockResolvedValue([
			{
				path: "./SuccessReport.json",
				name: "SuccessReport.json",
			},
		]);

		const moduleMetadata: ModuleMetadata = {
			id: "1234",
			type: "analysis",
			name: "Green IT",
			service: {
				name: "Green IT",
				logoUrl: "some-logo",
			},
		};

		const module = new GreenITModule(moduleMetadata, true);
		const analysisReport = await module.startAnalysis(Conf);

		expect(analysisReport).toHaveProperty("analyzedUrl", SuccessReport.url);
		expect(analysisReport).toHaveProperty("date", new Date(SuccessReport.date));
		expect(analysisReport).toHaveProperty(
			"grade",
			SuccessReport.pages[0].actions[0].grade,
		);
		expect(analysisReport).toHaveProperty(
			"normalizedGrade",
			SuccessReport.pages[0].actions[0].ecoIndex,
		);
		expect(analysisReport).toHaveProperty("service", moduleMetadata.service);
		expect(analysisReport).toHaveProperty("inputs", { config: Conf });
	});

	it("should be able to handle a failed analysis", async () => {
		createJsonReportsMock.mockResolvedValue([
			{
				path: "./ErrorReport.json",
				name: "ErrorReport.json",
			},
		]);

		const moduleMetadata: ModuleMetadata = {
			id: "1234",
			type: "analysis",
			name: "Green IT",
			service: {
				name: "Green IT",
				logoUrl: "some-logo",
			},
		};

		const module = new GreenITModule(moduleMetadata, true);

		await expect(module.startAnalysis(Conf)).rejects.toThrow(
			"Error during GreenIT analysis. Increasing the timeout can be a solution",
		);
	});

	it("should run a successful analysis with thresholds", async () => {
		createJsonReportsMock.mockResolvedValue([
			{
				path: "./SuccessReport.json",
				name: "SuccessReport.json",
			},
		]);

		const moduleMetadata: ModuleMetadata = {
			id: "1234",
			type: "analysis",
			name: "Green IT",
			service: {
				name: "Green IT",
				logoUrl: "some-logo",
			},
		};

		const THRESHOLD = 30;

		const module = new GreenITModule(moduleMetadata, true);
		const analysisReport = await module.startAnalysis(Conf, THRESHOLD);

		expect(analysisReport).toHaveProperty("analyzedUrl", SuccessReport.url);
		expect(analysisReport).toHaveProperty("date");
		expect(analysisReport).toHaveProperty(
			"grade",
			SuccessReport.pages[0].actions[0].grade,
		);
		expect(analysisReport).toHaveProperty(
			"normalizedGrade",
			SuccessReport.pages[0].actions[0].ecoIndex,
		);
		expect(analysisReport).toHaveProperty("service", moduleMetadata.service);
		expect(analysisReport).toHaveProperty("inputs", {
			config: Conf,
			threshold: THRESHOLD,
		});
	});

	it("should returns false when results do not match thresholds objectives", async () => {
		createJsonReportsMock.mockResolvedValue([
			{
				path: "./SuccessReport.json",
				name: "SuccessReport.json",
			},
		]);

		const moduleMetadata: ModuleMetadata = {
			id: "1234",
			type: "analysis",
			name: "Green IT",
			service: {
				name: "Green IT",
				logoUrl: "some-logo",
			},
		};

		const THRESHOLD = 30;

		const module = new GreenITModule(moduleMetadata, true);
		const analysisReport = await module.startAnalysis(Conf, THRESHOLD);

		expect(analysisReport).toHaveProperty("analyzedUrl", SuccessReport.url);
		expect(analysisReport).toHaveProperty("date");
		expect(analysisReport).toHaveProperty(
			"grade",
			SuccessReport.pages[0].actions[0].grade,
		);
		expect(analysisReport).toHaveProperty(
			"normalizedGrade",
			SuccessReport.pages[0].actions[0].ecoIndex,
		);
		expect(analysisReport).toHaveProperty("service", moduleMetadata.service);
		expect(analysisReport).toHaveProperty("inputs", {
			config: Conf,
			threshold: THRESHOLD,
		});
		expect(analysisReport.isThresholdReached()).toStrictEqual(false);
	});
});
