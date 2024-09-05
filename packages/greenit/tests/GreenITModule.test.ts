import type { ModuleMetadata } from "@scodi/common";
import { createJsonReports } from "greenit-cli/cli-core/analysis.js";
import { vol } from "memfs";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { GreenITModule } from "../src/GreenITModule.js";
import { Conf, ErrorReport, SuccessReport } from "./data.js";

vi.mock("node:fs");
vi.mock(import("greenit-cli/cli-core/analysis.js"), async (importOriginal) => {
	const mod = await importOriginal();
	return {
		...mod,
		createJsonReports: vi.fn(),
	};
});

describe("Run GreenIT analysis", () => {
	beforeAll(() => {
		// mock the file system and put on it these 2 mocked reports
		vol.fromJSON({
			"./ErrorReport.json": JSON.stringify(ErrorReport),
			"./SuccessReport.json": JSON.stringify(SuccessReport),
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should be able to launch a successful analysis without thresholds", async () => {
		vi.mocked(createJsonReports).mockResolvedValue([
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

		const module = new GreenITModule(moduleMetadata, false);
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
		vi.mocked(createJsonReports).mockResolvedValue([
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

		const module = new GreenITModule(moduleMetadata, false);

		await expect(() => module.startAnalysis(Conf)).rejects.toThrowError();
	});

	it("should be able to launch a successful analysis with thresholds", async () => {
		vi.mocked(createJsonReports).mockResolvedValue([
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

		const module = new GreenITModule(moduleMetadata, false);
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

	it("Should return false when results do not match thresholds objectives", async () => {
		vi.mocked(createJsonReports).mockResolvedValue([
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

		const module = new GreenITModule(moduleMetadata, false);
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
