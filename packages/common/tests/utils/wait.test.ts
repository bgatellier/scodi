import { describe, expect, it, mock, spyOn } from "bun:test";
import { wait } from "../../src/utils/wait.js";

describe("delayed execution", () => {
	it("should run a real timeout", async () => {
		const setTimeoutSpy = spyOn(globalThis, "setTimeout");

		// wait returns a promise, so we need to await it
		// but we also want to check setTimeout was called
		// We'll check the spy before awaiting to ensure it was called
		const waitPromise = wait(30);

		// Give a tiny bit of time for the promise to start
		// and setTimeout to be called

		expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
		expect(setTimeoutSpy).toHaveBeenLastCalledWith(expect.any(Function), 30);

		// Clean up
		mock.restore();

		// Await the promise to complete the test
		await waitPromise;
	});
});
