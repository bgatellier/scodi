import {
	type GenericReport,
	Module,
	type ModuleListenerInterface,
	type ModuleMetadata,
	type Result,
	logger,
} from "@scodi/common";
import { Client } from "./api/Client.js";
import { formatBlocks } from "./formatter/BlocksFormatter.js";
import { formatText } from "./formatter/TextFormatter.js";

export class SlackModule extends Module implements ModuleListenerInterface {
	readonly #client: Client;

	constructor(moduleMetadata: ModuleMetadata, verbose: boolean) {
		super(moduleMetadata, verbose);

		this.#client = new Client(verbose);

		if (verbose) {
			logger.info(`${moduleMetadata.name} initialized.`);
		}
	}

	public async notifyAnalysisDone(
		report: GenericReport<Result>,
	): Promise<unknown> {
		return this.#client.postMessage({
			blocks: formatBlocks(report),
			text: formatText(report),
			icon_url: report.service.logoUrl,
			username: report.service.name,
		});
	}
}
