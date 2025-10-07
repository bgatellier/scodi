import { env } from "node:process";
import {
	type ObservatoryConfig,
	type ObservatoryReport,
	Request,
} from "@scodi/common";
import { ObservatoryError } from "../error/ObservatoryError.js";
import { isScanError, type ScanError } from "./error/Error.js";

export class Client {
	readonly #analyzeUrl: string;
	readonly #apiUrl: string;
	#host = "";

	constructor() {
		this.#analyzeUrl = env.SCODI_OBSERVATORY_ANALYZE_URL ?? "";
		this.#apiUrl = env.SCODI_OBSERVATORY_API_URL ?? "";
	}

	public getAnalyzeUrl(): string {
		return this.#analyzeUrl + this.#host;
	}

	/**
	 * Get the summary of the analysis
	 */
	public async requestScan(): Promise<ObservatoryReport["result"]["scan"]> {
		return Request.get(`${this.#apiUrl}analyze?host=${this.#host}`);
	}

	/**
	 * Get detailed results about the tests run
	 */
	public async requestTests(
		scan: ObservatoryReport["result"]["scan"],
	): Promise<ObservatoryReport["result"]["tests"]> {
		return Request.get(`${this.#apiUrl}getScanResults?scan=${scan.scan_id}`);
	}

	public async triggerAnalysis(
		conf: ObservatoryConfig,
	): Promise<ObservatoryReport["result"]["scan"]> {
		this.#host = conf.host;

		const scan = await Request.post<
			ObservatoryReport["result"]["scan"] | ScanError
		>(`${this.#apiUrl}analyze?host=${this.#host}`, {
			host: conf.host,
			hidden: conf.hidden,
			rescan: conf.rescan,
		});

		// Observatory API is unconventional, and does not take advantage of http verbs :/
		if (isScanError(scan)) {
			throw new ObservatoryError(String(scan.error), { cause: scan.text });
		}

		return scan;
	}
}
