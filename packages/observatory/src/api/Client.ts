import { env } from "node:process";
import {
	type ObservatoryConfig,
	type ObservatoryReport,
	Request,
} from "@scodi/common";
import { ObservatoryError } from "../error/ObservatoryError.js";
import { isScanError, type ScanError } from "./error/Error.js";

export class Client {
	readonly #apiUrl: string;

	constructor() {
		this.#apiUrl = env.SCODI_OBSERVATORY_API_URL ?? "";
	}

	async requestResult(
		config: ObservatoryConfig,
	): Promise<ObservatoryReport["result"]> {
		const scan = await Request.post<ObservatoryReport["result"] | ScanError>(
			`${this.#apiUrl}scan?host=${config.host}`,
		);

		// Observatory API is unconventional, and does not take advantage of http verbs :/
		if (isScanError(scan)) {
			throw new ObservatoryError(String(scan.error), { cause: scan.message });
		}

		return scan;
	}
}
