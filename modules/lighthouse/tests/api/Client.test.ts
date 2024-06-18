import { Conf } from "../data/Conf.js";
import { vi, describe, it, expect } from "vitest";
import { requestResult } from "../../src/api/Client.js";

vi.mock("lighthouse", async (importOriginal) => {
	const mod = await importOriginal<typeof import("lighthouse")>();

	return {
		...mod,
		default: vi.fn().mockResolvedValue({
			lhr: {
				categories: {
					category1: { score: 67 },
					category2: { score: 74 },
					category3: { score: 95 },
					category4: { score: 88 },
					category5: { score: 53 },
				},
			},
		}),
	};
});

describe("Run an analysis", () => {
	it("should runs an analysis with a valid configuration", async () => {
		const results = await requestResult(Conf, false);
		expect(results).toStrictEqual({
			categories: {
				category1: { score: 67 },
				category2: { score: 74 },
				category3: { score: 95 },
				category4: { score: 88 },
				category5: { score: 53 },
			},
		});
	});
});
