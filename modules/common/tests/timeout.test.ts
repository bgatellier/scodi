import { expect, it, vi } from "vitest";
import { timeout } from "../src/time/timeout.js";

vi.useFakeTimers();
vi.spyOn(global, "setTimeout");

it("should run a real timeout", () => {
	void timeout(30);

	expect(setTimeout).toHaveBeenCalledTimes(1);
	expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 30);
});
