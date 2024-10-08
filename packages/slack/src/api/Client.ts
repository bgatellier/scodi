import { env } from "node:process";
import type { Block, KnownBlock, WebAPICallResult } from "@slack/web-api";
import { LogLevel, WebClient } from "@slack/web-api";

/**
 * Simple Slack client:
 * Initialize a Slack client using:
 * - the SCODI_SLACK_ACCESS_TOKEN process.env property
 * - the SCODI_SLACK_CHANNEL_ID process.env property
 */
export class Client {
	readonly #channel: string;
	readonly #client: WebClient;

	constructor(verbose: boolean) {
		this.#channel = env.SCODI_SLACK_CHANNEL_ID ?? "";
		this.#client = new WebClient(env.SCODI_SLACK_ACCESS_TOKEN, {
			logLevel: verbose ? LogLevel.INFO : undefined,
		});
	}

	public async postMessage(options: {
		blocks: (KnownBlock | Block)[];
		text: string;
		icon_url?: string;
		username?: string;
	}): Promise<WebAPICallResult> {
		return this.#client.chat.postMessage({
			channel: this.#channel,
			...options,
		});
	}
}
