import {
	afterAll,
	beforeAll,
	describe,
	expect,
	it,
	mock,
	spyOn,
} from "bun:test";
import { env } from "node:process";
import type { ObservatoryConfig } from "@scodi/common";
import { Request } from "@scodi/common";
import { Client } from "../../src/api/Client.js";
import { generateMockResult } from "../data/Result.js";

const API_URL = "www.observatory.mozilla/api";

const MOCK_CONF: ObservatoryConfig = { host: "www.website.test" };
const MOCK_RESULT = generateMockResult(MOCK_CONF);

describe("Client", () => {
	beforeAll(() => {
		env.SCODI_OBSERVATORY_API_URL = API_URL;
		spyOn(Request, "post").mockImplementation(() =>
			Promise.resolve(MOCK_RESULT),
		);
	});

	afterAll(() => {
		mock.restore();
	});

	env.SCODI_OBSERVATORY_API_URL = API_URL;

	it("Analyze with valid configuration", async () => {
		const client = new Client();

		const scan = await client.requestResult(MOCK_CONF);

		expect(scan).toStrictEqual(MOCK_RESULT);
	});

	it("Analyze with invalid configuration", async () => {
		const CONF = {} as ObservatoryConfig;

		const client = new Client();

		try {
			await client.requestResult(CONF);
		} catch (e) {
			expect(e).toHaveProperty("error");
		}
	});
});
