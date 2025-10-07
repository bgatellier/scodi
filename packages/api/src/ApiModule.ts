import cors, { type FastifyCorsOptions } from "@fastify/cors";
import {
	type Config,
	type GenericReport,
	getAnalysisValidationSchema,
	logger,
	Module,
	type ModuleAnalysisInterface,
	type ModuleListenerInterface,
	type ModuleMetadata,
	type ModuleServerInterface,
	type Result,
} from "@scodi/common";
import AjvErrors from "ajv-errors";
import Fastify, { type FastifyInstance } from "fastify";
import { createNotifyListenerModulesHandler } from "./notification/NotifyListenerModules.js";
import { createRouteHandler } from "./router/RouteHandler.js";

// using declaration merging, add your plugin props to the appropriate fastify interfaces
// if prop type is defined here, the value will be typechecked when you call decorate{,Request,Reply}
declare module "fastify" {
	interface FastifyRequest {
		report: GenericReport<Result>;
	}
}

export class ApiModule extends Module implements ModuleServerInterface {
	readonly #fastify: FastifyInstance;

	constructor(moduleMetadata: ModuleMetadata, verbose: boolean) {
		super(moduleMetadata, verbose);

		this.#fastify = this.#createFastifyInstance(verbose);

		if (verbose) {
			logger.info(`${moduleMetadata.name} initialized.`);
		}
	}

	async createServer(
		analysisModules: ModuleAnalysisInterface<Config, GenericReport<Result>>[],
		listenerModules: ModuleListenerInterface[],
		corsOptions?: FastifyCorsOptions,
	): Promise<FastifyInstance> {
		// plugins registration
		await this.#fastify.register(cors, corsOptions ?? {});

		// decorator registration
		this.#fastify.decorateRequest("report");

		// hooks registration
		this.#fastify.addHook(
			"onResponse",
			createNotifyListenerModulesHandler(listenerModules),
		);

		// route registration
		this.#registerRoutes(analysisModules, listenerModules);

		return this.#fastify;
	}

	#createFastifyInstance(verbose: boolean): FastifyInstance {
		return Fastify({
			logger: verbose,
			ajv: {
				customOptions: {
					allErrors: true,
				},
				plugins: [AjvErrors.default],
			},
		});
	}

	#registerRoutes(
		analysisModules: ModuleAnalysisInterface<Config, GenericReport<Result>>[],
		listenerModules: ModuleListenerInterface[],
	): void {
		const bodySchema = getAnalysisValidationSchema(
			listenerModules.map((m) => m.id),
		);

		analysisModules.forEach((analysisModule, _index) => {
			const path = `/${analysisModule.id}`;

			const routeHandler = createRouteHandler(analysisModule);

			this.#fastify.post(path, {
				handler: routeHandler,
				schema: {
					body: bodySchema,
				},
			});
		});
	}
}
