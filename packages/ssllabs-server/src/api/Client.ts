import { stringify } from "node:querystring";
import {
	Request,
	type SsllabsServerConfig,
	type SsllabsServerReport,
	SsllabsServerStatus,
} from "@scodi/common";
import { SsllabsServerError } from "../error/SsllabsServerError.js";
import {
	type SsllabsServerApiError,
	isSsllabsServerApiError,
} from "./Error.js";

const API_URL = "https://api.ssllabs.com/api/v3";
const SERVICE_URL = "https://www.ssllabs.com/ssltest/analyze.html?d=";

export class Client {
	#conf: SsllabsServerConfig = { host: "" };

	public async launchAnalysis(
		conf: SsllabsServerConfig,
	): Promise<SsllabsServerReport["result"]> {
		this.#conf = conf;

		return this.#requestApi();
	}

	public getProjectUrl(): string {
		return this.#conf.host;
	}

	public getAnalyzeUrl(): string {
		return SERVICE_URL + this.getProjectUrl();
	}

	public async getResult(): Promise<SsllabsServerReport["result"]> {
		// avoid starting a new analysis instead of requesting the results
		if ("string" === typeof this.#conf.startNew) {
			delete this.#conf.startNew;
		}

		return this.#requestApi();
	}

	#generateApiUrl(path: string): string {
		const query = stringify({
			host: this.#conf.host,
			publish: this.#conf.publish,
			startNew: this.#conf.startNew,
			fromCache: this.#conf.fromCache,
			maxAge: this.#conf.maxAge,
			all: this.#conf.all,
			ignoreMismatch: this.#conf.ignoreMismatch,
		});

		return `${API_URL}${path}?${query}`;
	}

	async #requestApi(): Promise<SsllabsServerReport["result"]> {
		const host = await Request.get<
			SsllabsServerReport["result"] | SsllabsServerApiError
		>(this.#generateApiUrl("/analyze"));

		if (isSsllabsServerApiError(host)) {
			const errorMessage = host.errors
				.map((error) => {
					return `error in field ${error.field}: ${error.message}`;
				})
				.join("\n");

			throw new SsllabsServerError(errorMessage);
		}

		if (host.status === SsllabsServerStatus.ERROR) {
			throw new SsllabsServerError(host.statusMessage);
		}

		return host;
	}
}
