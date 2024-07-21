import { describe, expect, it } from "vitest";
import { createServer } from "./build/CreateServer.js";
import { analysisModules } from "./data/AnalysisModules.js";
import { listenerModules } from "./data/ListenerModules.js";

describe("Start an analysis with an invalid request", () => {
	it("Get a 404 status code with an invalid verb and path", async () => {
		const fastify = await createServer(analysisModules, listenerModules);

		const response = await fastify.inject({
			method: "GET",
			url: "/invalid-path",
		});

		await fastify.close();

		expect(response.statusCode).toBe(404);
	});

	it("Get a 404 status code with an invalid verb but a valid path", async () => {
		const fastify = await createServer(analysisModules, listenerModules);

		const response = await fastify.inject({
			method: "GET",
			url: "/greenit",
		});

		await fastify.close();

		expect(response.statusCode).toBe(404);
	});

	it("Get a 404 status code with a valid verb but an invalid path", async () => {
		const fastify = await createServer(analysisModules, listenerModules);

		const response = await fastify.inject({
			method: "POST",
			url: "/invalid-path",
		});

		await fastify.close();

		expect(response.statusCode).toBe(404);
	});

	it("Get a 400 status code on POST /observatory with an missing body", async () => {
		const fastify = await createServer(analysisModules, listenerModules);

		const response = await fastify.inject({
			method: "POST",
			url: "/observatory",
		});

		await fastify.close();

		expect(response.statusCode).toBe(400);
	});

	it("Get a 400 status code on POST /observatory with an invalid format on the except_listeners property", async () => {
		const fastify = await createServer(analysisModules, listenerModules);

		const response = await fastify.inject({
			method: "POST",
			url: "/observatory",
			payload: {
				except_listeners: "wrong-format",
			},
		});

		await fastify.close();

		expect(response.statusCode).toBe(400);
	});

	it("Get a 400 status code on POST /greenit with a valid format but an incorrect value on the except_listeners property", async () => {
		const fastify = await createServer(analysisModules, listenerModules);

		const response = await fastify.inject({
			method: "POST",
			url: "/greenit",
			payload: {
				except_listeners: ["invalid-module-id"],
			},
		});

		await fastify.close();

		expect(response.statusCode).toBe(400);
	});

	it("Get a 400 status code on POST /observatory with an invalid format on the only_listeners property", async () => {
		const fastify = await createServer(analysisModules, listenerModules);

		const response = await fastify.inject({
			method: "POST",
			url: "/observatory",
			payload: {
				only_listeners: "wrong-format",
			},
		});

		await fastify.close();

		expect(response.statusCode).toBe(400);
	});

	it("Get a 400 status code on POST /greenit with a valid format but an incorrect value on the only_listeners property", async () => {
		const fastify = await createServer(analysisModules, listenerModules);

		const response = await fastify.inject({
			method: "POST",
			url: "/greenit",
			payload: {
				only_listeners: ["invalid-module-id"],
			},
		});

		await fastify.close();

		expect(response.statusCode).toBe(400);
	});

	it("Get a 400 status code on POST /greenit with an invalid threshold format", async () => {
		const fastify = await createServer(analysisModules, listenerModules);

		const response = await fastify.inject({
			method: "POST",
			url: "/greenit",
			payload: {},
			query: {
				threshold: "invalid",
			},
		});

		await fastify.close();

		expect(response.statusCode).toBe(400);
	});

	it("Get a 400 status code on POST /greenit with a valid threshold format but an incorrect value", async () => {
		const fastify = await createServer(analysisModules, listenerModules);

		const response = await fastify.inject({
			method: "POST",
			url: "/greenit",
			payload: {
				threshold: "123",
			},
		});

		await fastify.close();

		expect(response.statusCode).toBe(400);
	});
});

describe("Start an analysis with a valid request", () => {
	it("Get a 200 status code on POST /greenit with a valid body", async () => {
		const fastify = await createServer(analysisModules, listenerModules);

		const response = await fastify.inject({
			method: "POST",
			url: "/greenit",
			payload: {
				config: {
					url: "",
				},
			},
		});

		await fastify.close();

		expect(response.statusCode).toBe(200);
	});

	it("Get a 200 status code on POST /observatory with a valid body", async () => {
		const fastify = await createServer(analysisModules, listenerModules);

		const response = await fastify.inject({
			method: "POST",
			url: "/observatory",
			payload: {
				config: {
					url: "",
				},
			},
		});

		await fastify.close();

		expect(response.statusCode).toBe(200);
	});
});
