import type { Options } from "greenit-cli";
import type { Config } from "../Config.js";

// use Exclude instead of Pick to allow future new options.
// the goal is to be as close as possible of the dependency API.
export type GreenITConfig = Config &
	Partial<Exclude<Options, "ci" | "max_tab">> & {
		url: string;
	};
