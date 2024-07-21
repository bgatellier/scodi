import type { Service } from "../service/Service.js";

export interface ModuleMetadata {
	/**
	 * Example: observatory
	 */
	id: string;

	/**
	 * Example: Scodi Observatory
	 */
	name: string;

	service: Service;

	type: "analysis" | "listener" | "listener:database" | "server";
}
