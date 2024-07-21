import { env } from "node:process";
import type { ObservatoryConfig } from "@scodi/common";
import { Request } from "@scodi/common";
import { describe, expect, it, vi } from "vitest";
import { Client } from "../../src/api/Client.js";
import { RESULT } from "../data/Result.js";

const ANALYZE_URL = "www.observatory.mozilla/results";
const API_URL = "www.observatory.mozilla/api";

vi.spyOn(Request, "get").mockImplementation(() => Promise.resolve(RESULT));
vi.spyOn(Request, "post").mockImplementation(() => Promise.resolve(RESULT));

describe("Client", () => {
	env.SCODI_OBSERVATORY_ANALYZE_URL = ANALYZE_URL;
	env.SCODI_OBSERVATORY_API_URL = API_URL;

	it("Analyze with valid configuration", async () => {
		const CONF = { host: "www.website.test" };

		const client = new Client();

		const scan = await client.triggerAnalysis(CONF);

		expect(scan).toStrictEqual(RESULT);
		expect(client.getAnalyzeUrl()).toBe(ANALYZE_URL + CONF.host);
	});

	it("Analyze with invalid configuration", async () => {
		const CONF = {} as ObservatoryConfig;

		const client = new Client();

		try {
			await client.triggerAnalysis(CONF);
		} catch (e) {
			expect(e).toHaveProperty("error");
		}
	});
});
