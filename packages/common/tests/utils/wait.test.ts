import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { wait } from "../../src/utils/wait.js";

describe("delayed execution", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should run a real timeout", () => {
		vi.spyOn(global, "setTimeout");
		void wait(30);
		vi.runAllTimers();

		expect(setTimeout).toHaveBeenCalledTimes(1);
		expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 30);
	});
});
