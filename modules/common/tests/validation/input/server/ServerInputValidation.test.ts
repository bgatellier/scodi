import { describe, it, expect } from "vitest";
import { InputError } from "../../../../src/error/InputError.js";
import { validateServerInput } from "../../../../src/validation/input/server/ServerInputValidation.js";

describe("Valid cors value", () => {
	it("origin property with a string value", () => {
		const options = { cors: { origin: "http://127.0..0.1:8080/" } };
		const validatedData = validateServerInput(options);

		expect(validatedData).toBe(options);
	});

	it("origin property with a boolean value", () => {
		const options = { cors: { origin: true } };
		const validatedData = validateServerInput(options);

		expect(validatedData).toBe(options);
	});

	it("origin property with an string[] value", () => {
		const options = {
			cors: { origin: ["http://127.0..0.1:8080/", "http://127.0..0.1:8888/"] },
		};
		const validatedData = validateServerInput(options);

		expect(validatedData).toBe(options);
	});

	it("credentials property with a boolean value", () => {
		const options = { cors: { credentials: true } };
		const validatedData = validateServerInput(options);

		expect(validatedData).toBe(options);
	});

	it("exposedHeaders property with a string value", () => {
		const options = {
			cors: { exposedHeaders: "Content-Range,X-Content-Range" },
		};
		const validatedData = validateServerInput(options);

		expect(validatedData).toBe(options);
	});

	it("exposedHeaders property with an string[] value", () => {
		const options = {
			cors: { exposedHeaders: ["Content-Range", "X-Content-Range"] },
		};
		const validatedData = validateServerInput(options);

		expect(validatedData).toBe(options);
	});

	it("allowedHeaders property with a string value", () => {
		const options = { cors: { allowedHeaders: "Content-Type,Authorization" } };
		const validatedData = validateServerInput(options);

		expect(validatedData).toBe(options);
	});

	it("allowedHeaders property with an string[] value", () => {
		const options = {
			cors: { allowedHeaders: ["Content-Type", "Authorization"] },
		};
		const validatedData = validateServerInput(options);

		expect(validatedData).toBe(options);
	});

	it("methods property with a string value", () => {
		const options = { cors: { methods: "GET,PUT,POST" } };
		const validatedData = validateServerInput(options);

		expect(validatedData).toBe(options);
	});

	it("methods property with an string[] value", () => {
		const options = { cors: { methods: ["GET", "PUT", "POST"] } };
		const validatedData = validateServerInput(options);

		expect(validatedData).toBe(options);
	});

	it("preflightContinue property with a boolean value", () => {
		const options = { cors: { preflightContinue: true } };
		const validatedData = validateServerInput(options);

		expect(validatedData).toBe(options);
	});

	it("preflight property with a boolean value", () => {
		const options = { cors: { preflight: true } };
		const validatedData = validateServerInput(options);

		expect(validatedData).toBe(options);
	});

	it("strictPreflight property with a boolean value", () => {
		const options = { cors: { strictPreflight: true } };
		const validatedData = validateServerInput(options);

		expect(validatedData).toBe(options);
	});

	it("hideOptionsRoute property with a boolean value", () => {
		const options = { cors: { hideOptionsRoute: true } };
		const validatedData = validateServerInput(options);

		expect(validatedData).toBe(options);
	});
});

describe("Invalid port value", () => {
	it("Array", () => {
		expect(() => {
			validateServerInput({
				port: [],
			});
		}).toThrow(InputError);
	});

	it("JSON object", () => {
		expect(() => {
			validateServerInput({
				port: {},
			});
		}).toThrow(InputError);
	});

	it("Number < 0", () => {
		expect(() => {
			validateServerInput({
				port: -1,
			});
		}).toThrow(InputError);
	});

	it("Number > 65535", () => {
		expect(() => {
			validateServerInput({
				port: 65536,
			});
		}).toThrow(InputError);
	});

	it("String", () => {
		expect(() => {
			validateServerInput({
				port: "",
			});
		}).toThrow(InputError);
	});
});
