import { describe, it, expect } from "vitest";
import { InputError } from "../../../../src/error/InputError.js";
import type { ModuleMetadata } from "../../../../src/index.js";
import { validateAnalysisInput } from "../../../../src/validation/input/analysis/AnalysisInputValidation.js";

describe("Invalid option combinations", () => {
	it("Missing configuration", () => {
		expect(() => {
			validateAnalysisInput({});
		}).toThrow(InputError);
	});

	it("Both listener options", () => {
		expect(() => {
			validateAnalysisInput({
				config: { inline: "configuration" },
				except_listeners: [],
				only_listeners: [],
			});
		}).toThrow(InputError);
	});
});

describe("Valid configuration value", () => {
	it("JSON object with 1 property", () => {
		const { config } = validateAnalysisInput({ config: { url: "" } });

		expect(config).toStrictEqual({ url: "" });
	});

	it("JSON object with several properties", () => {
		const { config } = validateAnalysisInput({
			config: {
				url: "https://heart.fabernovel.com/",
				config: {
					extends: "lighthouse:default",
					settings: {
						maxWaitForFcp: 15000,
						maxWaitForLoad: 35000,
						skipAudits: ["uses-http2", "bf-cache"],
					},
				},
			},
		});

		expect(config).toStrictEqual({
			url: "https://heart.fabernovel.com/",
			config: {
				extends: "lighthouse:default",
				settings: {
					maxWaitForFcp: 15000,
					maxWaitForLoad: 35000,
					skipAudits: ["uses-http2", "bf-cache"],
				},
			},
		});
	});
});

describe("Invalid configuration value", () => {
	it("Array", () => {
		expect(() => {
			validateAnalysisInput({ config: [] });
		}).toThrow(InputError);
	});

	it("Empty JSON object", () => {
		expect(() => {
			validateAnalysisInput({ config: {} });
		}).toThrow(InputError);
	});

	it("Number", () => {
		expect(() => {
			validateAnalysisInput({ config: 2 });
		}).toThrow(InputError);
	});

	it("String", () => {
		expect(() => {
			validateAnalysisInput({ config: "" });
		}).toThrow(InputError);
	});
});

describe("Invalid threshold value", () => {
	it("Array", () => {
		expect(() => {
			validateAnalysisInput({
				config: { inline: "configuration" },
				threshold: [],
			});
		}).toThrow(InputError);
	});

	it("JSON object", () => {
		expect(() => {
			validateAnalysisInput({
				config: { inline: "configuration" },
				threshold: {},
			});
		}).toThrow(InputError);
	});

	it("Number < 0", () => {
		expect(() => {
			validateAnalysisInput({
				config: { inline: "configuration" },
				threshold: -1,
			});
		}).toThrow(InputError);
	});

	it("Number > 100", () => {
		expect(() => {
			validateAnalysisInput({
				config: { inline: "configuration" },
				threshold: 101,
			});
		}).toThrow(InputError);
	});

	it("String", () => {
		expect(() => {
			validateAnalysisInput({
				config: { inline: "configuration" },
				threshold: "",
			});
		}).toThrow(InputError);
	});
});

describe("Invalid listener options value", () => {
	const modulesMetadata: ModuleMetadata[] = [
		{
			id: "heart-test1",
			type: "analysis",
			name: "Heart Test1",
			service: { name: "Test1" },
		},
		{
			id: "heart-test2",
			type: "analysis",
			name: "Heart Test2",
			service: { name: "Test2" },
		},
	];
	const modulesIds = modulesMetadata.map((moduleMetadata) => moduleMetadata.id);

	it("Exclude 1 module with an invalid id", () => {
		expect(() => {
			validateAnalysisInput(
				{
					config: { inline: "configuration" },
					except_listeners: ["invalid-module-id"],
				},
				modulesIds,
			);
		}).toThrow(InputError);
	});

	it("Exclude 2 modules but set an invalid id for one of them", () => {
		expect(() => {
			validateAnalysisInput(
				{
					config: { inline: "configuration" },
					except_listeners: ["heart-test1", "invalid-module-id"],
				},
				modulesIds,
			);
		}).toThrow(InputError);
	});

	it("Keep only 1 module with an invalid id", () => {
		expect(() => {
			validateAnalysisInput(
				{
					config: { inline: "configuration" },
					only_listeners: ["invalid-module-id"],
				},
				modulesIds,
			);
		}).toThrow(InputError);
	});

	it("Keep 2 modules but set an invalid id for one of them", () => {
		expect(() => {
			validateAnalysisInput(
				{
					config: { inline: "configuration" },
					only_listeners: ["heart-test1", "invalid-module-id"],
				},
				modulesIds,
			);
		}).toThrow(InputError);
	});
});
