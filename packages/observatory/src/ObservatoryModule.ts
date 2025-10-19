import {
	logger,
	Module,
	type ModuleAnalysisInterface,
	type ModuleMetadata,
	type ObservatoryConfig,
	ObservatoryReport,
} from "@scodi/common";
import { Client } from "./api/Client.js";

export class ObservatoryModule
	extends Module
	implements ModuleAnalysisInterface<ObservatoryConfig, ObservatoryReport>
{
	readonly #client: Client;

	constructor(moduleMetadata: ModuleMetadata, verbose: boolean) {
		super(moduleMetadata, verbose);

		this.#client = new Client();

		if (verbose) {
			logger.info(`${moduleMetadata.name} initialized.`);
		}
	}

	public async startAnalysis(
		config: ObservatoryConfig,
		threshold?: number,
	): Promise<ObservatoryReport> {
		const scan = await this.#client.requestResult(config);

		return new ObservatoryReport({
			analyzedUrl: config.host,
			date: new Date(scan.scanned_at),
			result: scan,
			resultUrl: scan.details_url,
			service: this.service,
			inputs: {
				config: config,
				threshold: threshold,
			},
		});
	}
}
