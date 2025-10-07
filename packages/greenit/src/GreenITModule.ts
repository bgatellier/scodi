import {
	type Config,
	type GreenITConfig,
	GreenITReport,
	logger,
	Module,
	type ModuleAnalysisInterface,
	type ModuleMetadata,
} from "@scodi/common";
import { requestResult } from "./api/Client.js";

export class GreenITModule
	extends Module
	implements ModuleAnalysisInterface<GreenITConfig, GreenITReport>
{
	#threshold?: number;

	constructor(moduleMetadata: ModuleMetadata, verbose: boolean) {
		super(moduleMetadata, verbose);

		if (verbose) {
			logger.info(`${moduleMetadata.name} initialized.`);
		}
	}

	public async startAnalysis(
		config: GreenITConfig,
		threshold?: number,
	): Promise<GreenITReport> {
		this.#threshold = threshold;

		const result = await requestResult(config, this.verbose);

		return this.#handleResult(config, result);
	}

	#handleResult(
		config: Config,
		result: GreenITReport["result"],
	): GreenITReport {
		return new GreenITReport({
			analyzedUrl: result.url,
			date: new Date(result.date),
			result: result,
			service: this.service,
			inputs: {
				config: config,
				threshold: this.#threshold,
			},
		});
	}
}
