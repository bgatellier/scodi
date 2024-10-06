import {
	type Config,
	Helper,
	Module,
	type ModuleAnalysisInterface,
	type ModuleMetadata,
	type SsllabsServerConfig,
	SsllabsServerReport,
	SsllabsServerStatus,
	logger,
} from "@scodi/common";
import { Client } from "./api/Client.js";
import { SsllabsServerError } from "./error/SsllabsServerError.js";

const MAX_TRIES = 100;
const TIME_BETWEEN_TRIES = 10000; // 10 seconds

export class SsllabsServerModule
	extends Module
	implements ModuleAnalysisInterface<SsllabsServerConfig, SsllabsServerReport>
{
	readonly #client: Client;
	#threshold?: number;

	constructor(moduleMetadata: ModuleMetadata, verbose: boolean) {
		super(moduleMetadata, verbose);

		this.#client = new Client();

		if (verbose) {
			logger.info(`${moduleMetadata.name} initialized.`);
		}
	}

	public async startAnalysis(
		config: SsllabsServerConfig,
		threshold?: number,
	): Promise<SsllabsServerReport> {
		this.#threshold = threshold;

		await this.#client.launchAnalysis(config);

		return this.#requestResult(config);
	}

	async #handleResult(
		config: Config,
		result: SsllabsServerReport["result"],
		triesQty: number,
	): Promise<SsllabsServerReport> {
		switch (result.status) {
			case SsllabsServerStatus.ERROR: {
				const e = new SsllabsServerError(
					`${result.status}: ${result.statusMessage}`,
				);
				return Promise.reject(e);
			}

			case SsllabsServerStatus.DNS:
			case SsllabsServerStatus.IN_PROGRESS:
				await Helper.wait(TIME_BETWEEN_TRIES);
				return this.#requestResult(config, triesQty + 1);

			case SsllabsServerStatus.READY:
				return new SsllabsServerReport({
					analyzedUrl: this.#client.getProjectUrl(),
					date: new Date(result.startTime),
					result: result,
					resultUrl: this.#client.getAnalyzeUrl(),
					service: this.service,
					inputs: {
						config: config,
						threshold: this.#threshold,
					},
				});

			default: {
				const e = new SsllabsServerError(result.statusMessage);
				return Promise.reject(e);
			}
		}
	}

	async #requestResult(
		config: Config,
		triesQty = 1,
	): Promise<SsllabsServerReport> {
		if (triesQty > MAX_TRIES) {
			const e = new SsllabsServerError(
				`The maximum number of tries (${MAX_TRIES}) to retrieve the report has been reached.`,
			);
			return Promise.reject(e);
		}

		const result = await this.#client.getResult();

		return this.#handleResult(config, result, triesQty);
	}
}
